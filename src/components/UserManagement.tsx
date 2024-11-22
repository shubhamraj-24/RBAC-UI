
import React, { useEffect, useState, useCallback } from "react";
import { Snackbar, CircularProgress, Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Button, Modal, TextField, Select, MenuItem, TablePagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert, Switch } from "@mui/material";
import { getUsers, addUser, updateUser, deleteUser, getRoles } from "../api/api";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({ name: "", email: "", role: "", status: "Active" });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // Memoize filterUsers to avoid unnecessary re-renders
  const filterUsers = useCallback(() => {
    let result = [...users];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) || user.email.toLowerCase().includes(lowerQuery)
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((user) => user.status === statusFilter);
    }
    setFilteredUsers(result);
  }, [users, searchQuery, statusFilter]);  // Adding users, searchQuery, and statusFilter as dependencies

  useEffect(() => {
    filterUsers();  // Call filterUsers whenever the dependencies change
  }, [filterUsers]);  // Only re-run when filterUsers function is recreated

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const validateInputs = () => {
    if (!currentUser.name.trim() || !currentUser.email.trim() || !currentUser.role.trim()) {
      setErrorMessage("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentUser.email)) {
      setErrorMessage("Invalid email format.");
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateInputs()) return;

    const isDuplicateEmail = users.some(
      (user) => user.email === currentUser.email && user.id !== currentUser.id
    );

    if (isDuplicateEmail) {
      setSnackbarMessage("Email already exists. Please use a different email.");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (currentUser.id) {
        await updateUser(currentUser.id, currentUser);
        setSnackbarMessage("User updated successfully!");
      } else {
        await addUser(currentUser);
        setSnackbarMessage("User added successfully!");
      }
      setSnackbarOpen(true);
      setOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      setSnackbarMessage("Failed to save user. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (selectedUserId !== null) {
        await deleteUser(selectedUserId);
        loadUsers();
        setDeleteDialogOpen(false);
        setSnackbarMessage("User deleted successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Failed to delete user. Please try again.");
    }
  };

  const toggleStatus = async (user: any) => {
    try {
      const updatedUser = { ...user, status: user.status === "Active" ? "Inactive" : "Active" };

      // Optimistically update the UI before API call
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );

      // Call the API to update the status
      await updateUser(user.id, updatedUser);

      setSnackbarMessage("User status updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error toggling status:", error);
      setErrorMessage("Failed to update user status. Please try again.");
      // Revert the UI change if API call fails
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u))
      );
    }
  };


  return (
    <Box sx={{ padding: 2 }}>
      <h2>User Management</h2>
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentUser({ name: "", email: "", role: "", status: "Active" });
              setOpen(true);
            }}
          >
            Add User
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={roles.some(role => role.name === user.role) ? user.role : "Unassigned"}
                      onChange={async (e) => {
                        const updatedUser = { ...user, role: e.target.value };
                        try {
                          await updateUser(user.id, updatedUser);
                          loadUsers();
                          setSnackbarMessage(`Role updated to "${e.target.value}" successfully.`);
                          setSnackbarOpen(true);
                        } catch (error) {
                          console.error("Error updating role:", error);
                          setErrorMessage("Failed to update role. Please try again.");
                        }
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))}
                      <MenuItem value="Unassigned">Unassigned</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Switch
                        checked={user.status === "Active"}
                        onChange={() => toggleStatus(user)}
                        color="primary"
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {user.status === "Active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => { setCurrentUser(user); setOpen(true); }}>Edit</Button>
                    <Button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setDeleteDialogOpen(true);
                      }}
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setCurrentUser({ name: "", email: "", role: "", status: "Active" });
        }}
      >
        <Box sx={{ padding: 2, backgroundColor: "#fff", margin: "100px auto", width: "400px" }}>
          <h3>{currentUser.id ? "Edit User" : "Add User"}</h3>
          <TextField
            label="Name"
            fullWidth
            value={currentUser.name}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={currentUser.email}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            margin="normal"
          />
          <TextField
            select
            label="Role"
            fullWidth
            value={currentUser.role}
            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
            margin="normal"
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <Button onClick={handleAddUser} variant="contained" color="primary" fullWidth>
            {currentUser.id ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserManagement;
