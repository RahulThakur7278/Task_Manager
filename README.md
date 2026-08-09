# TaskFlow — Advanced Task Manager

A production-grade full-stack **MERN** (MongoDB, Express, React, Node.js) Task Manager application with premium UI, authentication, analytics, and drag-and-drop functionality.

## ✨ Features

### Core Features
- ✅ Add, complete, and delete tasks
- 🔍 Search tasks with debounced input
- 🎯 Filter tasks (All, Completed, Pending)
- 📄 Server-side pagination
- 🔄 Drag-and-drop reordering (`@hello-pangea/dnd`)
- 📊 Analytics dashboard with charts (Recharts)

### React Challenges
- 🪝 **Custom Hooks**: `useLocalStorage`, `useDebounce`
- 🌐 **Context API**: `AuthContext`, `TaskContext`, `ThemeContext` (no prop drilling)
- ⚡ **Performance**: `React.memo`, `useCallback`, `useMemo`
- ✏️ **Form Validation**: Empty task prevention with inline error display

### CSS Challenges
- 🌓 Dark/Light mode toggle with persistence
- 🎬 CSS animations (slide-in/out, fade, shake)
- 📱 Responsive mobile-first design (Tailwind CSS v4)
- 🖱️ Drag-and-drop task reordering

### Authentication
- 🔐 JWT-based (Access + Refresh tokens)
- 🍪 HttpOnly cookies for refresh tokens
- 🔒 Protected routes with auto-redirect
- 👤 Register / Login / Logout flow

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 18, Vite, Tailwind CSS v4, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt, HttpOnly cookies |
| Validation | Zod (server), custom (client) |
| Drag & Drop | @hello-pangea/dnd |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Task-Manager

# Install all dependencies
npm run install-all
```

### Configuration

1. Copy the example environment file:
```bash
cp server/.env.example server/.env
```

2. Update `server/.env` with your MongoDB URI:
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
```

### Running the App

```bash
# Run both server and client concurrently
npm run dev

# Run server only
npm run server

# Run client only
npm run client
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
Task-Manager/
├── server/                  # Express API
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── middleware/           # Auth, validation, error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helpers
│   └── server.js            # Entry point
├── client/                  # React + Vite
│   └── src/
│       ├── api/             # Axios instance
│       ├── components/      # UI components
│       ├── context/         # React Contexts
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Route pages
│       └── utils/           # Constants
├── package.json             # Root scripts
└── README.md
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|:---|:---|:---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/api/tasks` | Get tasks (paginated, filterable, searchable) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PUT | `/api/tasks/reorder` | Reorder tasks |
| GET | `/api/tasks/analytics` | Get task analytics |

## 📄 License

ISC
