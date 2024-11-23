# **RBAC UI - Role-Based Access Control (RBAC) Interface**

## **Project Overview**

The **RBAC UI** is a React-based web application designed to demonstrate a Role-Based Access Control (RBAC) system. It allows administrators to manage users, roles, and permissions dynamically in a secure and user-friendly interface. This project includes functionalities for user management, role assignment, and permission management using mock API data, simulated by **JSON Server**.

**Key Features:**
- **User Management**: View, add, edit, delete, and manage user roles and statuses.
- **Role Management**: Create and modify roles, and assign permissions to them.
- **Dynamic Permissions**: Assign or remove specific permissions (Read, Write, Delete etc.) to roles, enabling role-based actions for users.
- **Mock API**: Utilizes JSON Server to simulate API endpoints for CRUD operations on users, roles and permissions.

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

### **1. Prerequisites**
Before you begin, ensure you have met the following requirements:
- **Node.js**: Make sure you have Node.js and npm installed. You can download it from [Node.js official website](https://nodejs.org/).
- **Git**: Ensure you have Git installed for version control. You can download it from [Git official website](https://git-scm.com/).

### **2. Clone the Repository**

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/shubhamraj-24/RBAC-UI.git
cd RBAC-UI
```

### **3. Install Dependencies**
Install the required dependencies using npm:

```bash
npm install
```
This will install all necessary libraries including React, Material UI, Axios, and JSON Server.

### **4. Set Up JSON Server (Mock API)**
In the root directory of the project, there is a file named `db.json` which contains mock data for users, roles and permissions :

```json
{
  "users": [
    { "id": 1, "name": "Admin", "email": "admin@vrv.com", "role": "Admin", "status": "Active" },
    { "id": 2, "name": "User1", "email": "user1@vrv.com", "role": "Editor", "status": "Inactive" }
  ],
  "roles": [
    { "id": 1, "name": "Admin", "permissions": ["Read", "Write", "Delete"] },
    { "id": 2, "name": "Editor", "permissions": ["Read", "Write"] }
  ],
  "permissions": [
    { "id": "1", "name": "Read"},
    { "id": "2", "name": "Write"},
    { "id": "3", "name": "Delete"}
  ]
}
```

Open a terminal and start the JSON Server to simulate API endpoints:

```bash
npx json-server --watch db.json --port 5000
```
This will run the server at `http://localhost:5000` and expose mock API endpoints for managing users, roles and permissions.

### **5. Start the React App**
Open a second terminal and start the React application using the following command:

```bash
npm start
```
This will run the React application at `http://localhost:3000`. You can now interact with the User Management, Role Management, and Permissions Management interfaces.

---

## **Folder Structure**
The project follows a standard React folder structure with some modifications for clarity:

```
rbac-ui/
├── db.json                 # Mock API data for JSON Server
├── node_modules/           # Project dependencies
├── public/                 # Public assets (index.html, favicon, etc.)
├── src/                    # Source code
│   ├── api/                # API helper functions for CRUD operations
│   │   └── api.ts
│   ├── components/         # React components
│   │   ├── UserManagement.tsx
│   │   ├── RoleManagement.tsx
│   │   └── Permissions.tsx
│   ├── App.tsx             # Main App component with routing
│   └── index.tsx           # React entry point
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## **API Endpoints Examples (Mocked by JSON Server)**
- **GET /users** – Get all users.
- **GET /users/{id}** – Get a specific user by ID.
- **POST /users** – Create a new user.
- **PUT /users/{id}** – Update an existing user.
- **DELETE /users/{id}** – Delete a user.
- **GET /roles** – Get all roles.
- **GET /roles/{id}** – Get a specific role by ID.
- **POST /roles** – Create a new role.
- **PUT /roles/{id}** – Update an existing role.
- **DELETE /roles/{id}** – Delete a role.

---

## **How to Contribute**
If you'd like to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your forked repository (`git push origin feature-name`).
5. Create a pull request.

---

## **Conclusion**
This RBAC UI project offers a simple yet functional implementation of a Role-Based Access Control system with a clean user interface for managing users, roles, and permissions. The use of React and Material UI ensures that the application is both responsive and user-friendly.
