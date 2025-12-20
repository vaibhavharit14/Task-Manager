# Task Manager Application

A full-stack Task Manager built for collaboration, real-time updates, and recruiter-ready demonstration.  
Frontend powered by React + TypeScript + TailwindCSS, backend by Node.js + Express + TypeScript, database with PostgreSQL + Prisma, and real-time communication via Socket.io.  
Deployed on Vercel (frontend) and Render (backend).

---

## Live Demo
- Frontend (Vercel): https://task-manager-orpin-five.vercel.app/ 
- Backend (Render): https://task-manager-oggh.onrender.com

---

## Features
- Authentication (JWT based login/register)
- User management (register, login, fetch current user)
- Task CRUD (create, update, delete, assign tasks)
- Real-time updates (Socket.io for instant task sync)
- Scalable architecture (modular UI + clean backend APIs)
- Validation and error handling (Zod + custom middleware)
- Responsive UI (TailwindCSS, mobile-first design)

---

## Tech Stack

**Frontend**
- React + TypeScript
- TailwindCSS
- React Query
- React Hook Form
- Axios

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- Socket.io

**Deployment**
- Frontend → Vercel
- Backend → Render

---
## Project Structure


task-manager/ │ ├── backend/                  # Node.js + Express + TypeScript + Prisma │   ├── src/ │   │   ├── controllers/      # Route controllers (auth, tasks) │   │   ├── middleware/       # Auth & error handling middleware │   │   ├── routes/           # API route definitions │   │   ├── types/            # Custom TypeScript types (global.d.ts) │   │   ├── utils/            # Helper functions (JWT, validation) │   │   ├── server.ts         # Express app entry point │   │   └── index.ts          # Main backend entry │   ├── prisma/ │   │   └── schema.prisma     # Database schema │   ├── package.json │   └── tsconfig.json │ ├── frontend/                 # React + TypeScript + Vite + Tailwind │   ├── src/ │   │   ├── components/       # Reusable UI components │   │   ├── pages/            # Page-level components (Login, Dashboard) │   │   ├── hooks/            # Custom React hooks │   │   ├── context/          # Global state/context providers │   │   ├── services/         # API calls (axios + React Query) │   │   ├── App.tsx           # Root component │   │   └── main.tsx          # React DOM entry │   ├── public/               # Static assets │   ├── package.json │   └── tsconfig.json │ ├── README.md                 # Recruiter-ready documentation └── .gitignore

