# TaskFlow - Team Task Manager 🚀

![TaskFlow Header](https://via.placeholder.com/1200x400/6366f1/ffffff?text=TaskFlow+-+Team+Task+Manager)

TaskFlow is a production-ready, full-stack MERN application designed to help teams collaborate, organize projects, and track tasks efficiently. Built as an internship selection assignment, it features role-based access control, interactive Kanban boards, and a comprehensive analytics dashboard.

## 🛠️ Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based login/signup with Admin and Member roles.
- **Dynamic Dashboard**: View total tasks, completion rates, overdue tasks, and visualized analytics via Recharts.
- **Project Management**: Create projects, customize colors, and manage team member access.
- **Interactive Kanban Boards**: Drag-and-drop task management powered by `@dnd-kit`.
- **Advanced Task Tracking**: Assign users, set priorities, establish due dates, and leave comments.
- **Responsive Modern UI**: Glass-morphism design, dark mode by default, and mobile-friendly layouts.

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone <repository-url>
cd assignment_ethara
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory using the provided `.env.example` as a template (see Environment Variables section below).
```bash
# Start the backend server in development mode
npm run dev
```

### 3. Frontend Setup
Open a new terminal window.
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
# Start the Vite development server
npm run dev
```
The application will be running at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API Server Port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing tokens | `super_secret_string_123` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Application environment | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🚀 Deployment

> **Note to Evaluator regarding Railway:** The assignment instructions requested deployment on Railway. However, my Railway free trial has ended and the platform now requires a paid upgrade to host services. To fulfill the deployment mandate while remaining on free tiers, I have successfully deployed the application using the industry-standard free alternatives: **Render (Backend)** and **Vercel (Frontend)**.

### 1. Database (MongoDB Atlas)
- Deploy a MongoDB database on MongoDB Atlas (Free Tier) and retrieve the connection string.
- Whitelist `0.0.0.0/0` in Atlas Network Access.

### 2. Backend Service (Render)
- Go to [Render.com](https://render.com/) and create a new **Web Service**.
- Connect your GitHub repo and set the Root Directory to `backend`.
- Build Command: `npm install`
- Start Command: `node server.js`
- Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (set to your Vercel URL later).

### 3. Frontend Service (Vercel)
- Go to [Vercel.com](https://vercel.com/) and create a new Project.
- Connect your GitHub repo and set the Root Directory to `frontend`.
- Vercel will automatically detect Vite and set the build commands.
- Add Environment Variable: `VITE_API_URL` pointing to your live Render backend URL (e.g., `https://your-backend.onrender.com/api`).

---

## 📚 API Documentation Reference

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| **POST** | `/api/auth/register` | No | Any | Register new user |
| **POST** | `/api/auth/login` | No | Any | Login user |
| **GET** | `/api/auth/me` | Yes | Any | Get current user profile |
| **GET** | `/api/projects` | Yes | Any | Get user's projects |
| **POST** | `/api/projects` | Yes | Any | Create a new project |
| **GET** | `/api/projects/:id` | Yes | Member | Get project details |
| **PUT** | `/api/projects/:id` | Yes | Admin | Update project details |
| **POST** | `/api/tasks` | Yes | Admin | Create new task |
| **GET** | `/api/tasks/project/:id`| Yes | Member | Get all tasks for a project |
| **PUT** | `/api/tasks/:id` | Yes | Admin/Assignee| Update a task |
| **DELETE**| `/api/tasks/:id` | Yes | Admin | Delete a task |
| **PUT** | `/api/tasks/:id/assign` | Yes | Admin | Assign task to a user |
| **POST** | `/api/tasks/:id/comment`| Yes | Member | Add a comment to task |
| **GET** | `/api/dashboard` | Yes | Any | Get dashboard statistics |

---

## 🤝 Contributing
This project was developed specifically for an assignment evaluation. However, feel free to fork and modify it for your own use cases!

*Developed by Samrath*
