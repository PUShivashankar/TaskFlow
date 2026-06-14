# TaskFlow – Full-Stack Task Manager

A full-stack task management application with JWT authentication and AI-powered task suggestions. Built with a **React + Vite** frontend and a **Spring Boot** backend, connected via a REST API.

---

## Features

- **JWT Authentication** — register, log in, and stay authenticated across sessions; automatic logout on token expiry
- **Full Task CRUD** — create, view, update, and delete tasks through modal forms
- **AI Suggest** — auto-fills a task's description, priority, and estimated time from its title
- **Quick Status Toggle** — cycle tasks between `TODO`, `IN_PROGRESS`, and `DONE` directly from the task card
- **Filtering & Search** — filter tasks by keyword, status, or priority
- **Stats Dashboard** — live counts and a progress bar summarizing task completion
- **Due Date Warnings** — overdue tasks highlighted in red, due-soon tasks in orange
- **Toast Notifications** — real-time success and error feedback
- **Responsive Design** — works on mobile and desktop

---

## Tech Stack

### Frontend

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| react-hot-toast | Toast notifications |
| lucide-react | Icons |
| date-fns | Date formatting |

### Backend

| Technology | Purpose |
|---|---|
| Java 21 | Language |
| Spring Boot 3.5.3 | Application framework |
| Spring Security + JWT (jjwt 0.12.6) | Stateless authentication |
| Spring Data JPA + Hibernate | ORM and database access |
| PostgreSQL | Database |
| Lombok | Boilerplate reduction |
| Maven | Build tool |

---

## Repository Structure

```
taskflow/
├── task-manager-frontend/       # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js           # Dev proxy: /api → http://localhost:8080
│   └── src/
│       ├── api/                 # Axios client, auth & task API calls
│       ├── context/             # Auth context & helpers
│       ├── hooks/               # useTasks — CRUD state & server sync
│       ├── utils/               # Status/priority configs, date formatters
│       ├── components/
│       │   ├── auth/            # ProtectedRoute
│       │   ├── layout/          # Navbar, AppLayout
│       │   ├── tasks/           # TaskCard, TaskForm, TaskFilters, StatsBar
│       │   └── ui/              # Modal, ConfirmDialog, Badges, Spinner, etc.
│       └── pages/               # LoginPage, RegisterPage, DashboardPage
│
└── task-management/             # Spring Boot backend
    └── src/main/java/com/example/task_management/
        ├── config/              # Security configuration
        ├── controller/          # REST controllers (Auth, Task)
        ├── dto/                 # Request/response DTOs
        ├── entity/              # JPA entities (User, Task, TaskStatus)
        ├── repository/          # Spring Data JPA repositories
        ├── security/            # JWT service, filter, UserDetailsService
        └── service/             # Business logic (AuthService, TaskService)
```

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| Java JDK | 21 |
| Maven | 3.9+ (or use the included `mvnw` wrapper) |
| PostgreSQL | Running locally |

---

## Getting Started

### 1. Backend Setup

**Configure the database and JWT secret** in `task-management/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/task_management
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secret=your_long_random_secret_key

server.port=8080
```

> **Security note:** Never commit real credentials to version control. Use environment variables or an external config file for production deployments.

Before running, create the PostgreSQL database:

```sql
CREATE DATABASE task_management;
```

**Run the backend:**

```bash
cd task-management

# macOS / Linux
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### 2. Frontend Setup

```bash
cd task-manager-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The Vite dev server automatically proxies `/api` requests to the backend at `http://localhost:8080`.

---

### 3. Production Build

**Backend** — produces a runnable JAR:

```bash
./mvnw clean package
java -jar target/task_management-0.0.1-SNAPSHOT.jar
```

**Frontend** — outputs static files to `dist/`:

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive a JWT |

**Register request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Auth response:**
```json
{
  "token": "jwt-token-string",
  "message": "Login successful"
}
```

### Tasks

All task endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks for the logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update an existing task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PATCH | `/api/tasks/{id}/status` | Update only the status of a task |
| POST | `/api/tasks/ai-suggest` | Get AI-suggested description, priority, and estimated time |

**Task request body:**
```json
{
  "title": "Fix login bug",
  "description": "Resolve issue with login page",
  "priority": "HIGH",
  "estimatedTime": "2 hours",
  "dueDate": "2026-06-20",
  "status": "TODO"
}
```

**AI Suggest request / response:**
```json
// Request
{ "title": "Fix login bug" }

// Response
{
  "description": "Break the issue down into smaller steps, identify blockers, and update the status as you progress.",
  "priority": "HIGH",
  "estimatedTime": "2 hours"
}
```

**Task status values:** `TODO` · `IN_PROGRESS` · `DONE`

---

## Authentication Flow

1. On register or login, the backend generates and returns a JWT.
2. The frontend stores the token in `localStorage` and attaches it as a `Bearer` token to every subsequent request via an Axios interceptor.
3. If any request returns `401 Unauthorized`, the token is cleared and the user is redirected to `/login`.
4. The `/dashboard` route is wrapped in `ProtectedRoute`, which automatically redirects unauthenticated users to the login page.

---

## Security

- Passwords are hashed with **BCrypt** before storage.
- Authentication is **stateless** — no sessions; every request must carry a valid JWT.
- `/api/auth/**` endpoints are public; all other endpoints require authentication.
- Tasks are **user-scoped** — users can only access, modify, or delete their own tasks.
