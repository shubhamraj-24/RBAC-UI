import React, { useState, useEffect } from "react";
import {
  getRoles,
  updateRole,
  getPermissions,
  addPermission,
  removePermission,
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
  Checkbox,
  TextField,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Paper,
  Tooltip,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Permission {
  id: number;
  name: string;
}

const Permissions: React.FC = () => {
  const theme = useTheme(); // Access Material-UI theme
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [newPermission, setNewPermission] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

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
    setAllPermissions(response.data);
  };

  const handleAddPermission = async () => {
    if (newPermission && !allPermissions.some((perm) => perm.name === newPermission)) {
      await addPermission(newPermission);
      setSnackbarMessage("Permission added successfully!");
      setSnackbarOpen(true);
      loadPermissions();
      setNewPermission("");
    }
  };

  const confirmRemovePermission = (permissionId: number) => {
    setPermissionToDelete(permissionId);
    setDeleteDialogOpen(true);
  };

  const handleRemovePermission = async () => {
    if (permissionToDelete !== null) {
      const updatedRoles = roles.map((role) => ({
        ...role,
        permissions: role.permissions.filter((perm: string) =>
          !allPermissions.some((p) => p.id === permissionToDelete && p.name === perm)
        ),
      }));

      await Promise.all(updatedRoles.map((role) => updateRole(role.id, role)));
      await removePermission(permissionToDelete);

      setSnackbarMessage("Permission deleted successfully!");
      setSnackbarOpen(true);

      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
      loadRoles();
      loadPermissions();
    }
  };

  const togglePermission = async (role: any, permission: string) => {
    const updatedPermissions = role.permissions.includes(permission)
      ? role.permissions.filter((perm: string) => perm !== permission)
      : [...role.permissions, permission];

    await updateRole(role.id, { ...role, permissions: updatedPermissions });
    loadRoles();
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Permissions Management
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            label="New Permission"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddPermission}
          >
            Add Permission
          </Button>
        </Grid>
      </Grid>

      {roles.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No roles available.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Role Name
                  </TableCell>
                  {allPermissions.map((perm) => (
                    <TableCell
                      key={perm.id}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
                        color: theme.palette.text.primary,
                      }}
                      align="center"
                    >
                      {perm.name}
                      <Tooltip title="Delete Permission">
                        <IconButton
                          size="small"
                          onClick={() => confirmRemovePermission(perm.id)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  ))}
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
                    {allPermissions.map((perm) => (
                      <TableCell key={perm.id} align="center">
                        <Checkbox
                          checked={role.permissions.includes(perm.name)}
                          onChange={() => togglePermission(role, perm.name)}
                          sx={{
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this permission? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRemovePermission} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Permissions;








