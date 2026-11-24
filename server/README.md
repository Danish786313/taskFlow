# TaskFlow Backend API

A modular, scalable, and robust RESTful API backend for the **TaskFlow Task Management Application**, built with **Node.js, Express, Sequelize ORM, MySQL, JWT, and bcrypt**.

---

## 🚀 Features

- **Authentication Module:**
  - Secure password hashing using `bcrypt` (10 salt rounds).
  - JWT token generation with safe user claims.
  - User registration (`POST /api/signup`).
  - User authentication (`POST /api/login`).
  - Token verification middleware (`authenticateToken` & `optionalAuthenticateToken`).
- **Task Management Module:**
  - **Create Task (`POST /api/tasks`):** Title validation, auto-generated assignee initials, status and priority normalization.
  - **Get Task by ID (`GET /api/tasks/:id`):** Fetch single task details by ID.
  - **Update Task (`PUT /api/tasks/:id`):** Update title, description, status, priority, due date, assignee, or tags.
  - **Delete Task (`DELETE /api/tasks/:id`):** Permanent deletion of tasks.
  - **Unified Task List API (`myTaskList`):** Single reusable controller powering both **All Tasks** and **My Tasks** with dynamic multi-attribute filtering, keyword search, flexible sorting, and global pagination.
- **Global Pagination Utility (`utils/pagination.js`):**
  - Standardized page, limit, and offset calculations.
  - Consistent pagination metadata (`totalItems`, `currentPage`, `pageSize`, `totalPages`, `hasNextPage`, `hasPrevPage`).
- **Standardized Response Handler (`utils/responsHandler.js`):**
  - Consistent API envelope (`data`, `message`, `status`, optional extras like `token` and `pagination`).

---

## 📁 Project Structure

```text
server/
├── app.js                          # Express application entry & middleware configuration
├── package.json
├── .env                            # Environment configuration (PORT, JWT_SECRET, etc.)
├── .env.example
├── config/
│   └── config.json                 # Sequelize MySQL configuration
├── models/
│   ├── index.js                    # Sequelize connection & model loader
│   ├── user.js                     # User model definition
│   └── task.js                     # Task model definition
├── migrations/
│   ├── 20261123163810-create-user.js
│   └── 20261123163943-create-task.js
├── middleware/
│   └── authMiddleware.js           # JWT Bearer token authentication
├── controllers/
│   ├── authController.js           # Signup & Login controller logic
│   └── taskController.js           # Task CRUD & unified myTaskList controller
├── routes/
│   └── routes.js                   # RESTful API route definitions
└── utils/
    ├── responsHandler.js           # Standardized response envelopes
    ├── responseHandler.js          # Re-export alias
    └── pagination.js               # Global pagination utility
```

---

## 📡 API Endpoints & Documentation

### Base URL: `http://localhost:2000/api`

---

### 1. Authentication Endpoints

#### `POST /api/signup`
Creates a new user account.

- **Request Body:**
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex.morgan@taskflow.dev",
    "password": "password123",
    "role": "Frontend Lead"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "data": {
      "id": 1,
      "name": "Alex Morgan",
      "email": "alex.morgan@taskflow.dev",
      "role": "Frontend Lead",
      "initials": "AM",
      "avatarColor": "#4f46e5",
      "department": "Engineering",
      "createdAt": "2026-11-23T22:33:45.000Z"
    },
    "message": "User created successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### `POST /api/login`
Authenticates a user and returns a signed JWT session token.

- **Request Body:**
  ```json
  {
    "email": "alex.morgan@taskflow.dev",
    "password": "password123"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "data": {
      "id": 1,
      "name": "Alex Morgan",
      "email": "alex.morgan@taskflow.dev",
      "role": "Frontend Lead",
      "initials": "AM",
      "avatarColor": "#4f46e5",
      "department": "Engineering"
    },
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 2. Task Management Endpoints

#### `POST /api/tasks`
Creates a new task.

- **Headers:** `Authorization: Bearer <token>` (optional, auto-assigns creator if omitted)
- **Request Body:**
  ```json
  {
    "title": "Design Kanban board responsive cards",
    "description": "Create modern UI components for column drag and drop.",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-11-30",
    "assignedTo": "Alex Morgan",
    "tags": ["Design", "UI/UX"]
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "data": {
      "id": 101,
      "title": "Design Kanban board responsive cards",
      "description": "Create modern UI components for column drag and drop.",
      "status": "todo",
      "priority": "high",
      "dueDate": "2026-11-30",
      "assignedTo": "Alex Morgan",
      "assigneeInitials": "AM",
      "tags": "Design, UI/UX",
      "createdAt": "2026-11-23T22:45:00.000Z",
      "updatedAt": "2026-11-23T22:45:00.000Z"
    },
    "message": "Task created successfully"
  }
  ```

---

#### `GET /api/tasks` & `GET /api/my-tasks` (Unified List API)
Fetches tasks with multi-attribute filtering, keyword search, sorting, and pagination.

- **Query Parameters:**
  | Parameter | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | `page` | Integer | `1` | Page number for pagination |
  | `limit` / `pageSize` | Integer | `10` | Items per page (max: 100) |
  | `search` | String | `""` | Search keyword across title, description, tags, assignee |
  | `status` | String | `"all"` | Filter by status (`todo`, `in_progress`, `review`, `completed`) |
  | `priority` | String | `"all"` | Filter by priority (`low`, `medium`, `high`) |
  | `assignedTo` | String | `""` | Filter by assignee name |
  | `myTasks` | Boolean | `false` | When `true`, filters tasks assigned to logged-in user |
  | `sortBy` | String | `"createdAt"` | Sort attribute (`createdAt`, `dueDate`, `title`, `priority`) |
  | `sortOrder`| String | `"DESC"` | Sort direction (`ASC` or `DESC`) |

- **Example Request:**
  `GET /api/tasks?search=Kanban&status=todo&priority=high&page=1&limit=10&sortBy=dueDate&sortOrder=ASC`

- **Response (`200 OK`):**
  ```json
  {
    "data": [
      {
        "id": 101,
        "title": "Design Kanban board responsive cards",
        "description": "Create modern UI components for column drag and drop.",
        "status": "todo",
        "priority": "high",
        "dueDate": "2026-11-30",
        "assignedTo": "Alex Morgan",
        "assigneeInitials": "AM",
        "tags": "Design, UI/UX"
      }
    ],
    "message": "Tasks retrieved successfully",
    "pagination": {
      "totalItems": 1,
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

- **My Tasks (Assigned to logged-in user):**
  - Via query parameter: `GET /api/tasks?myTasks=true`
  - Via dedicated route: `GET /api/my-tasks`
  - Reuses the identical `myTaskList` controller logic.

---

#### `GET /api/tasks/:id`
Retrieves a single task by its primary key ID.

- **Response (`200 OK`):**
  ```json
  {
    "data": {
      "id": 101,
      "title": "Design Kanban board responsive cards",
      "status": "todo",
      "priority": "high"
    },
    "message": "Task retrieved successfully"
  }
  ```

---

#### `PUT /api/tasks/:id`
Updates an existing task.

- **Request Body:** Any subset of fields to update (`title`, `description`, `status`, `priority`, `dueDate`, `assignedTo`, `tags`).
- **Response (`200 OK`):**
  ```json
  {
    "data": {
      "id": 101,
      "title": "Design Kanban board responsive cards",
      "status": "in_progress",
      "priority": "high"
    },
    "message": "Task updated successfully"
  }
  ```

---

#### `DELETE /api/tasks/:id`
Permanently deletes a task.

- **Response (`200 OK`):**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

## 🛠️ Global Pagination Utility (`utils/pagination.js`)

```javascript
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

// 1. Extract params
const { page, limit, offset } = getPaginationParams(req.query, 10, 100);

// 2. Query with Sequelize
const { count, rows } = await Model.findAndCountAll({ where, limit, offset, order });

// 3. Format metadata
const paginatedData = formatPaginatedResponse(rows, count, page, limit);

// 4. Send response via responseHandler
return responseHandler.successResponseData(res, paginatedData.items, 200, 'Success', {
    pagination: paginatedData.pagination
});
```

---

## 🚦 Running the Backend Server

```bash
cd server
npm install
node app.js
```
The server will start listening at `http://localhost:2000`.
