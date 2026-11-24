# TaskFlow — React.js Task Management Frontend Skeleton

A modern, responsive, and robust **frontend skeleton for a Task Management Application** built with **React.js, HTML5, CSS3, and React Router DOM**.

This project provides a complete user interface with authentication flows, a Kanban-style dashboard, full CRUD operations on tasks using state and dummy data, live search filtering, pagination, and a clean modular architecture ready for backend API integration.

---

## 🌟 Key Features

### 1. 🔐 Authentication Module
- **Login Page (`/login`):** Email and password input fields, real-time client-side validation, "Remember me" option, "Forgot password" navigation, and a 1-click **"Auto Fill Demo Credentials"** helper for instant evaluation.
- **Signup Page (`/signup`):** Name, email, password, and password confirmation with validation checks.
- **Forgot Password Page (`/forgot-password`):** Email submission form with success state confirming mock reset link dispatch.
- **Logout:** Sign-out option available from both the sidebar and top navbar user menu, with a modal confirmation dialog that safely redirects to `/login`.

### 2. 📊 Dashboard Module (Kanban-Style)
- **Real-Time Task Statistics Cards:**
  - **Total Tasks:** Total deliverables count with percentage completed badge.
  - **Pending Tasks (To Do):** Count of unstarted sprint tasks.
  - **In-Progress Tasks:** Active ongoing development tasks.
  - **Completed Tasks:** Delivered tasks count.
- **Kanban Board:**
  - 4 workflow columns: **To Do**, **In Progress**, **Review**, and **Completed**.
  - Dynamic count badges and status color indicators.
  - Quick "+ Add Task" button on each column header.
  - Quick column advancement controls on task cards for effortless status transitions.
  - Detailed task cards with priority badges (High, Medium, Low), assignee avatars, due dates (with overdue warnings), tags, and context menus.

### 3. 📝 Task Management Module (CRUD)
- **Create Task:** Accessible via the sidebar button, navbar button, dashboard, or task list header. Modal includes validation for Title, Description, Status, Priority, Due Date, Assignee, and Tags.
- **View All Tasks (`/tasks`):**
  - Dual view modes: **Table View** and **Grid Cards View**.
  - Inline status selector dropdown in the table view.
  - Detailed Task Inspector modal with workflow stage switchers.
- **Update Task:** Full edit modal with pre-populated fields to modify title, description, priority, assignee, due date, tags, and status.
- **Delete Task:** Destructive action protected by a confirmation modal.
- **Search & Filter:**
  - Live search by task title, description, assignee name, or tag keyword.
  - Status filter (All, To Do, In Progress, Review, Completed).
  - Priority filter (All, Low, Medium, High).
  - Multi-attribute sorting (Due Date, Priority, Title).
- **Pagination:**
  - Page navigation controls (Previous, Next, Numbered page buttons).
  - Results counter ("Showing X to Y of Z results").
  - Configurable page size (5, 10, 20 items per page).

### 4. 🗂️ Dedicated Views
- **My Tasks (`/my-tasks`):** Pre-filtered view showing only tasks assigned to the currently logged-in user.
- **Completed Tasks (`/completed-tasks`):** Dedicated archive of finished sprint deliverables.
- **Workspace Settings (`/settings`):** Account profile settings, notification preferences toggles, and backend readiness notes.
- **404 Not Found Page:** Custom catch-all route with return button.

### 5. 🎨 Common Layout & UI System
- **Navbar:** Sticky header featuring responsive hamburger menu, search input, notifications bell with unread badge counter and dropdown panel, fast "+ New Task" trigger, and user profile menu.
- **Sidebar:** Brand identity, navigation links with active state highlighting, sprint completion progress bar, user info card, and fast sign-out trigger.
- **Responsive Drawer:** Slide-out sidebar with backdrop overlay for tablet and mobile screens.
- **Toast Notifications:** Non-intrusive floating feedback messages for task creation, edits, deletions, and status changes.

---

## 🛠️ Technology Stack

- **React.js 19** – Functional components and React Hooks (`useState`, `useEffect`, `useContext`, `useMemo`, `useRef`).
- **React Router DOM v7** – Declarative client-side routing, protected routes, and layouts.
- **HTML5 & CSS3** – Pure CSS with CSS Variables / Design Tokens (no third-party CSS framework dependencies).
- **Vite** – Lightning-fast build tool and development server.

---

## 📁 Project Structure

```text
client/
├── index.html                  # HTML5 entry template with Inter font
├── vite.config.js              # Vite configuration
├── package.json
└── src/
    ├── main.jsx                # Application root mount
    ├── App.jsx                 # Provider wrappers & Router setup
    │
    ├── assets/                 # SVGs and images
    │
    ├── styles/                 # Global styles & design tokens
    │   ├── variables.css       # CSS Variables (colors, spacing, shadows, z-indices)
    │   └── global.css          # Reset, base typography, buttons, and badges
    │
    ├── data/                   # Initial static/dummy data
    │   ├── dummyTasks.js       # Preloaded tasks, statuses, priorities, team members
    │   └── dummyUser.js        # Current user profile & mock notifications
    │
    ├── utils/                  # Helper functions
    │   ├── validators.js       # Form validation (email, password, required)
    │   └── dateUtils.js        # Date formatting, overdue check, day counters
    │
    ├── context/                # Global React Context
    │   ├── AuthContext.jsx     # Auth state, login, signup, forgot password, logout
    │   └── TaskContext.jsx     # Task CRUD state, notifications, search, toasts
    │
    ├── components/             # Reusable UI components (each with dedicated CSS)
    │   ├── Icons/
    │   │   └── Icons.jsx       # Custom scalable SVG icon library
    │   ├── Navbar/
    │   │   ├── Navbar.jsx
    │   │   └── Navbar.css
    │   ├── Sidebar/
    │   │   ├── Sidebar.jsx
    │   │   └── Sidebar.css
    │   ├── StatCard/
    │   │   ├── StatCard.jsx
    │   │   └── StatCard.css
    │   ├── TaskCard/
    │   │   ├── TaskCard.jsx
    │   │   └── TaskCard.css
    │   ├── TaskModal/
    │   │   ├── TaskModal.jsx
    │   │   └── TaskModal.css
    │   ├── TaskDetailsModal/
    │   │   ├── TaskDetailsModal.jsx
    │   │   └── TaskDetailsModal.css
    │   ├── ConfirmDialog/
    │   │   ├── ConfirmDialog.jsx
    │   │   └── ConfirmDialog.css
    │   ├── Pagination/
    │   │   ├── Pagination.jsx
    │   │   └── Pagination.css
    │   └── Toast/
    │       ├── Toast.jsx
    │       └── Toast.css
    │
    ├── layouts/                # Route layouts
    │   ├── AuthLayout.jsx      # Branded split-screen layout for auth pages
    │   ├── AuthLayout.css
    │   ├── DashboardLayout.jsx # App layout with Sidebar, Navbar, and Modals
    │   └── DashboardLayout.css
    │
    ├── pages/                  # Page-level components
    │   ├── Auth/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── Auth.css
    │   ├── Dashboard/
    │   │   ├── Dashboard.jsx
    │   │   └── Dashboard.css
    │   ├── Tasks/
    │   │   ├── AllTasks.jsx
    │   │   ├── MyTasks.jsx
    │   │   ├── CompletedTasks.jsx
    │   │   └── Tasks.css
    │   ├── Settings/
    │   │   ├── Settings.jsx
    │   │   └── Settings.css
    │   └── NotFound/
    │       ├── NotFound.jsx
    │       └── NotFound.css
    │
    └── routes/
        └── AppRoutes.jsx       # Route tree with Protected & Public route guards
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be live at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 🔌 Future Backend Integration Guide (Node.js / Express)

This skeleton was deliberately structured to make connecting a Node.js / Express backend seamless:

1. **API Service Layer:** Create an `src/services/api.js` (or using `axios` / `fetch`) with base URL configuration and request interceptors to send Bearer JWT tokens.
2. **Auth Integration:** Replace the simulated promises in `src/context/AuthContext.jsx` with calls to `POST /api/auth/login`, `POST /api/auth/register`, and `POST /api/auth/forgot-password`. Store the JWT in `localStorage` or `httpOnly` cookies.
3. **Task CRUD Integration:** Replace `useState(INITIAL_TASKS)` in `src/context/TaskContext.jsx` with `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, and `DELETE /api/tasks/:id`.
4. **Data Shapes:** The dummy task structure matches standard MongoDB/PostgreSQL schemas (`id`, `title`, `description`, `status`, `priority`, `dueDate`, `assignedTo`, `tags`, `createdAt`).
