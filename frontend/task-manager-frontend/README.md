# TaskFlow – Frontend

A modern React frontend for the **Task Management** Spring Boot backend.  
Built with Vite, React 18, Tailwind CSS, and React Router v6.

---

## Features

- **JWT Authentication** – Login & Register with token stored in localStorage; auto-logout on 401
- **Task CRUD** – Create, Read, Update, Delete tasks via modal forms
- **AI Suggest** – Click "AI Suggest" on the task form to auto-fill description, priority, and estimated time from the title (calls `POST /api/tasks/ai-suggest`)
- **Quick Status Toggle** – Click the dot on any task card to cycle status (TODO → IN_PROGRESS → DONE)
- **Filters** – Search by keyword, filter by status or priority
- **Stats Dashboard** – Live counts + progress bar
- **Priority & Status Badges** – Color-coded visual indicators
- **Due Date Warnings** – Overdue tasks highlighted in red; due-soon in orange
- **Toast Notifications** – Success/error feedback on every action
- **Fully Responsive** – Works on mobile and desktop

---

## Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| react-hot-toast | Toast notifications |
| lucide-react | Icons |

---

## Folder Structure

```
task-manager-frontend/
├── index.html
├── package.json
├── vite.config.js           # Dev server proxies /api → http://localhost:8080
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx             # Entry point
    ├── App.jsx              # Router + Toaster setup
    ├── index.css            # Tailwind + custom component classes
    │
    ├── api/
    │   ├── axiosClient.js   # Axios instance, JWT interceptor, 401 auto-logout
    │   ├── authApi.js       # POST /api/auth/register, /api/auth/login
    │   └── taskApi.js       # GET/POST/PUT/DELETE /api/tasks, AI suggest
    │
    ├── context/
    │   └── AuthContext.jsx  # Auth state, login/register/logout helpers
    │
    ├── hooks/
    │   └── useTasks.js      # Tasks CRUD state + server sync
    │
    ├── utils/
    │   └── helpers.js       # Status/priority configs, date formatters
    │
    ├── components/
    │   ├── auth/
    │   │   └── ProtectedRoute.jsx
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   └── AppLayout.jsx
    │   ├── tasks/
    │   │   ├── TaskCard.jsx       # Individual task card
    │   │   ├── TaskForm.jsx       # Create/Edit form with AI Suggest
    │   │   ├── TaskFilters.jsx    # Search + status + priority filters
    │   │   └── StatsBar.jsx       # Summary counts + progress bar
    │   └── ui/
    │       ├── Modal.jsx
    │       ├── ConfirmDialog.jsx
    │       ├── EmptyState.jsx
    │       ├── Spinner.jsx
    │       ├── StatusBadge.jsx
    │       └── PriorityBadge.jsx
    │
    └── pages/
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── DashboardPage.jsx
        └── NotFoundPage.jsx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The Java backend running on `http://localhost:8080`

### Install & Run

```bash
cd task-manager-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
# Output in dist/
```

---

## API Endpoints Expected

The frontend calls these backend endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/status` | Update status only |
| POST | `/api/tasks/ai-suggest` | AI description/priority/time from title |

> **Note:** The backend currently has `AuthController` and the DTOs ready. You need to add `TaskController` and `TaskService` to the Spring Boot project. See the Task Request/Response DTOs — they match exactly what this frontend sends.

---

## Backend Integration Notes

### TaskController to implement (Spring Boot)

```java
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll(Principal principal) { ... }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest req, Principal principal) { ... }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id, @RequestBody TaskRequest req, Principal principal) { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) { ... }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String,String> body, Principal principal) { ... }

    @PostMapping("/ai-suggest")
    public ResponseEntity<AiResponse> aiSuggest(@Valid @RequestBody AiRequest req) { ... }
}
```

### CORS

The backend `AuthController` already has `@CrossOrigin(origins = "*")`. Add the same to your `TaskController`, or configure it globally in `SecurityConfig`.

---

## Environment / Proxy

The Vite dev server proxies `/api/*` to `http://localhost:8080` automatically (configured in `vite.config.js`), so no CORS issues during development.

For production, either:
- Deploy frontend behind the same domain as the backend, or
- Set `VITE_API_BASE_URL` and update `axiosClient.js` accordingly.
