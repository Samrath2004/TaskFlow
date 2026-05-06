# 🚀 TaskFlow - Team Task Manager

![TaskFlow Header](https://placehold.co/1200x400/6366f1/ffffff?text=TaskFlow+-+Team+Task+Manager)

**TaskFlow** is a modern, full-stack web application designed to help teams collaborate, organize projects, and track tasks effortlessly. Built with the MERN stack, it features secure role-based access, drag-and-drop Kanban boards, and a beautiful real-time analytics dashboard.

---

## 🔗 Live Demo
Check out the live application here:
**👉 [https://task-flow-rho-pied.vercel.app](https://task-flow-rho-pied.vercel.app)**

*(Note: The backend is hosted on a free Render tier, which may take ~50 seconds to spin up on your first visit!)*

### 🔑 Demo Admin Credentials
If you prefer not to register a new account to test the Admin features, you can log in using the pre-configured global Admin account:
- **Email:** `samrathagarwal2004@gmail.com`
- **Password:** `samrath@123`

---

## 🎯 How It Works (Application Flow)
Understanding TaskFlow is simple! Here is the user journey:

1. **Role Assignment:** The very first person to register an account automatically becomes the global `Admin`. All subsequent users default to the `Member` role.
2. **Creating Workspaces:** **Any** user can create new Projects. When a user creates a project, they automatically become the `Admin` of that specific project workspace.
3. **Building the Team:** Inside a project, the Project Admin navigates to the **Members** tab to invite other registered users to the project.
4. **Task Delegation:** The Project Admin uses the Kanban **Board** to create tasks, set priorities, establish due dates, and assign them directly to team members.
5. **Member Experience:** When a Member logs in, they only see projects they were invited to. Inside the board, they only see tasks assigned to them. They can drag-and-drop their tasks across columns to update the status.
6. **Real-Time Analytics:** As tasks are moved, the global **Dashboard** instantly updates its charts and graphs to reflect team progress!

---

## 🛠️ Tech Stack

**Frontend:**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

**Backend:**
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 💻 Getting Started (Local Setup)
Follow these beginner-friendly steps to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Or create a free cloud database using MongoDB Atlas)
- Git

### 1. Clone the repository
Open your terminal and run:
```bash
git clone https://github.com/Samrath2004/TaskFlow.git
cd TaskFlow
```

### 2. Setup the Backend
The backend runs the API and connects to the database.
```bash
cd backend
npm install
```
Create a file named `.env` inside the `backend` folder and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=super_secret_string_123
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a **new, separate terminal window** and run:
```bash
cd frontend
npm install
```
Create a file named `.env` inside the `frontend` folder and add:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the React application:
```bash
npm run dev
```

**You're done!** Open your browser and go to `http://localhost:5173` to see the app running.

---

## 🚀 Deployment Notice

> **Note to Evaluator regarding Railway:** The assignment instructions requested deployment on Railway. However, my Railway free trial has ended and the platform now requires a paid upgrade to host services. To fulfill the deployment mandate while remaining on free tiers, I have successfully deployed the application using the industry-standard free alternatives: **Render (Backend)** and **Vercel (Frontend)**.

---

## 🤝 Contributing
This project was developed as a full-stack internship assignment. Feel free to fork it, learn from it, or modify it for your own personal use!

*Developed by Samrath*
