
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// User APIs
export const getUsers = () => axios.get(`${API_URL}/users`);
export const addUser = (user: any) => axios.post(`${API_URL}/users`, user);
export const updateUser = (id: number, user: any) => axios.put(`${API_URL}/users/${id}`, user);
export const deleteUser = (id: number) => axios.delete(`${API_URL}/users/${id}`);

// Role APIs
export const getRoles = () => axios.get(`${API_URL}/roles`);
export const addRole = (role: any) => axios.post(`${API_URL}/roles`, role);
export const updateRole = (id: number, role: any) => axios.put(`${API_URL}/roles/${id}`, role);
export const deleteRole = (id: number) => axios.delete(`${API_URL}/roles/${id}`);

// Permission APIs
export const getPermissions = () => axios.get(`${API_URL}/permissions`);
export const addPermission = (name: string) =>
  axios.post(`${API_URL}/permissions`, { name });
export const removePermission = (id: number) =>
  axios.delete(`${API_URL}/permissions/${id}`);