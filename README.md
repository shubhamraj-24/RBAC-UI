# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
# **RBAC UI - Role-Based Access Control (RBAC) Interface**

## **Project Overview**

The **RBAC UI** is a React-based web application designed to demonstrate a Role-Based Access Control (RBAC) system. It allows administrators to manage users, roles, and permissions dynamically in a secure and user-friendly interface. This project includes functionalities for user management, role assignment, and permission management using mock API data, simulated by **JSON Server**.

**Key Features:**
- **User Management**: View, add, edit, delete, and manage user roles and statuses.
- **Role Management**: Create and modify roles, and assign permissions to them.
- **Dynamic Permissions**: Assign or remove specific permissions (Read, Write, Delete) to roles, enabling role-based actions for users.
- **Mock API**: Utilizes JSON Server to simulate API endpoints for CRUD operations on users and roles.

---

## **Technologies Used**
- **Frontend**: React, TypeScript
- **UI Framework**: Material UI
- **Mock API**: JSON Server
- **Routing**: React Router DOM

---

## **Features Explained**

### **1. User Management**
- **Add User**: Administrators can create new users by providing details such as name, email, role, and status (Active/Inactive).
- **Edit User**: Admins can modify user details (e.g., role, status) and update them.
- **Delete User**: Admins can remove users from the system.
- **User Role Assignment**: Admins can assign roles (Admin, Editor, etc.) to users.

### **2. Role Management**
- **Create Role**: Admins can define new roles (Admin, Editor, etc.) and specify the permissions associated with each role.
- **Edit Role**: Admins can modify existing roles, including changing the role name and permissions.
- **Delete Role**: Admins can delete roles from the system.
- **Permissions Assignment**: Roles are assigned permissions, which define what actions users with that role can perform (e.g., Read, Write, Delete).

### **3. Dynamic Permissions**
- **Assign/Remove Permissions**: Admins can toggle permissions (Read, Write, Delete) for each role. Permissions can be added or removed with a simple checkbox interface.
- **Real-time Updates**: Changes made to permissions are immediately reflected in the role's permissions list.

---

## **Project Setup Instructions**

### **1. Clone the Repository**

Clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
cd rbac-ui
