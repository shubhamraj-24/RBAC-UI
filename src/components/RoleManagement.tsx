import React, { useEffect, useState } from "react";
import {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  getPermissions,
} from "../api/api";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  TextField,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const RoleManagement: React.FC = () => {
  const theme = useTheme();
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>({ name: "", permissions: [] });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    const response = await getRoles();
    setRoles(response.data);
  };

  const loadPermissions = async () => {
    const response = await getPermissions();
    setPermissions(response.data);
  };

  const handleAddRole = async () => {
    if (!currentRole.name.trim()) {
      setSnackbarMessage("Role name is required!");
      setSnackbarOpen(true);
      return;
    }

    const roleExists = roles.some(
      (role) =>
        role.name.toLowerCase() === currentRole.name.toLowerCase() &&
        role.id !== currentRole.id
    );

    if (roleExists) {
      setSnackbarMessage("Role already exists!");
      setSnackbarOpen(true);
      return;
    }

    if (currentRole.id) {
      await updateRole(currentRole.id, currentRole);
      setSnackbarMessage("Role updated successfully!");
    } else {
      await addRole(currentRole);
      setSnackbarMessage("Role added successfully!");
    }

    setOpen(false);
    loadRoles();
    setCurrentRole({ name: "", permissions: [] });
    setSnackbarOpen(true);
  };

  const confirmDeleteRole = (id: number) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteRole = async () => {
    if (roleToDelete !== null) {
      await deleteRole(roleToDelete);
      setSnackbarMessage("Role deleted successfully!");
      setSnackbarOpen(true);
      loadRoles();
    }
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setOpen(true);
              setCurrentRole({ name: "", permissions: [] });
            }}
          >
            Add Role
          </Button>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
                  color: theme.palette.text.primary,
                }}
              >
                Role Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
                  color: theme.palette.text.primary,
                }}
              >
                Permissions
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
                  color: theme.palette.text.primary,
                }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <TableRow
                key={role.id}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? index % 2 === 0
                        ? "#333333"
                        : "#424242"
                      : index % 2 === 0
                      ? "#fafafa"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#555555" : "#f0f0f0",
                  },
                }}
              >
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.permissions.filter(Boolean).length > 0
                    ? role.permissions.filter(Boolean).join(", ")
                    : "No permissions"}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setCurrentRole(role);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => confirmDeleteRole(role.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add/Edit Role Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            padding: 3,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            margin: "auto",
            width: "90%",
            maxWidth: "400px",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {currentRole.id ? "Edit Role" : "Add Role"}
          </Typography>
          <TextField
            label="Role Name"
            fullWidth
            variant="outlined"
            value={currentRole.name}
            onChange={(e) =>
              setCurrentRole({ ...currentRole, name: e.target.value })
            }
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={currentRole.permissions}
              onChange={(e) =>
                setCurrentRole({
                  ...currentRole,
                  permissions: e.target.value as string[],
                })
              }
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.name}>
                  <Checkbox
                    checked={currentRole.permissions.includes(permission.name)}
                  />
                  <ListItemText primary={permission.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddRole}
          >
            {currentRole.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this role? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteRole} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default RoleManagement;

