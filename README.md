# Full-Stack MERN To-Do List Application

A modern full-stack To-Do List web application built with the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js).

---

## Features

- **Backend (Node.js + Express + MongoDB/Mongoose)**:
  - **Task Model**: Mongoose schema with `title` (String, required), `completed` (Boolean, default false), and `createdAt` (Date, default `Date.now`).
  - **REST API Endpoints**:
    - `GET /api/tasks` — Fetch all tasks (sorted by newest first).
    - `POST /api/tasks` — Add a new task (`{ "title": "string" }`).
    - `PUT /api/tasks/:id` — Update a task (toggle `completed` or update `title`).
    - `DELETE /api/tasks/:id` — Delete a task by ID.

- **Frontend (React + Vite)**:
  - Add task form with instant state update.
  - Interactive task list fetched dynamically on page load.
  - Custom checkbox to toggle completion status with strikethrough styling.
  - Inline title editing capability.
  - Task deletion with real-time UI synchronization without page reload.
  - Filter by **All**, **Active**, and **Completed** tasks with remaining item counters.
  - Modern, responsive dark glassmorphism design.

---

## Project Structure

```
To-do-list/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose Task Schema & Model
│   ├── routes/
│   │   └── tasks.js         # Express REST API routes for /api/tasks
│   ├── .env                 # Environment variables (PORT, MONGODB_URI)
│   ├── .env.example         # Example environment template
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express server initialization & MongoDB connection
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main To-Do application component
│   │   ├── App.css          # Component styles & layout
│   │   ├── index.css        # Global CSS design tokens
│   │   └── main.jsx         # React DOM entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies & scripts
│   └── vite.config.js       # Vite configuration with backend API proxy
├── package.json             # Root helper scripts
└── README.md                # Project documentation & run guide
```

---

## Prerequisites

Before running the application, make sure you have:
1. **Node.js** (v18 or higher recommended)
2. **npm**
3. **MongoDB** (Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI)

---

## Setup & Running the Application

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env` (already created, modify if using MongoDB Atlas):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo-app
   ```
   > **Note for MongoDB Atlas users**: Replace `MONGODB_URI` with your connection string:  
   > `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority`

4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will start on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:3000` (or `http://localhost:5173`).*

4. Open your browser and navigate to `http://localhost:3000` to use the application.

---

## REST API Documentation

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks | None | Array of Task objects |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "Task name" }` | Created Task object (`201`) |
| `PUT` | `/api/tasks/:id` | Update task status or title | `{ "completed": true }` or `{ "title": "New" }` | Updated Task object (`200`) |
| `DELETE` | `/api/tasks/:id` | Delete a task | None | `{ "message": "Task deleted successfully", "id": "..." }` |

---

## Screenshots

The screenshots of the working application are saved in the `screenshots/` folder:
- **`screenshots/1_add_task.png`**: Adding tasks and immediate list updates.
- **`screenshots/2_complete_task.png`**: Toggling task completion status.
- **`screenshots/3_delete_task.png`**: Deleting tasks and dynamic filtering.

