# TaskHub

TaskHub is a full-stack task management application (REST API + React frontend) built with Node.js, Express, MongoDB and a Vite + React frontend. It supports user authentication (JWT), role-based access (admin / member), task assignment, checklists, progress tracking, file uploads for profile images and task attachments, and exportable reports.


## Features

- User registration and login (JWT)
- Role-based access: admin and member
- Create, update, delete tasks (admin)
- Assign tasks to users, todo checklists per task
- Task status, priority, due dates and progress calculation
- Dashboard endpoints for admin and users
- Export reports (tasks / users) and upcoming-deadline views
- Profile image upload and attachments folder served statically

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JSON Web Tokens (JWT), bcrypt for password hashing
- File uploads: multer
- Frontend: React + Vite, Tailwind (used in project dependencies)


### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud Atlas)

### Backend setup

1. Open a terminal and change into the backend folder:

```powershell or Command Prompt
cd "d:\Coding Language\Project\TaskHub\backend"
```

2. Install dependencies and create an `.env` file:

```powershell or Command Prompt
npm install 
copy .env.example .env  # or create .env manually
```

3. Set required environment variables in `.env` (see below).

4. Start the backend server:

```powershell or Command Prompt
npm run dev   # uses nodemon (development)
# or
npm start     # production / simple node
```

The backend server listens on `process.env.PORT` or `5000` by default.

### Frontend setup

1. Open a new terminal and change into the frontend app:

```powershell or Command Prompt
cd "d:\Coding Language\Project\TaskHub\frontend\task-manager"
```

2. Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

This starts the Vite dev server (default port 5173). The frontend expects the backend API at the URL set by `CLIENT_URL` (or you can configure axios base URL in `frontend/src/utils/axiosInstance.js`).

## Environment variables

Create a `.env` file in the `backend/` folder containing at least the following:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret string used to sign JWTs
- `JWT_EXPIRES_IN` — (optional) JWT expiry, e.g. `7d` (default `7d`)
- `PORT` — (optional) backend port (default 5000)
- `CLIENT_URL` — (optional) allowed client origin for CORS
- `ADMIN_INVITE_TOKEN` — (optional) token used during registration to create admin users

Example `.env` (do NOT commit secrets):

MONGO_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/taskhub
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=
PORT=5000
CLIENT_URL=
ADMIN_INVITE_TOKEN=


## Available scripts

Backend (`backend/package.json`):

- `npm run dev` — start server with nodemon
- `npm start` — run `node server.js`

Frontend (`frontend/task-manager/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview built assets

## API summary

Base URL: `http://localhost:5000/api` (adjust `PORT` as needed)

Authentication: send `Authorization: Bearer <token>` header for protected endpoints.

## File uploads

- Uploaded files are stored under `backend/uploads` and served statically at `/uploads`.
- Profile image upload endpoint: `POST /api/auth/upload-image` (multipart form, field `image`). The response contains an `imageUrl` you can save to the user's profile.

## Notes & assumptions

- The frontend's axios instance expects the backend base URL to be configured; check `frontend/task-manager/src/utils/axiosInstance.js`.
- Frontend dev server default is the Vite default (5173). If you use a different port, set `CLIENT_URL` accordingly.
- If you want to create an admin through registration, provide `adminInviteToken` that matches `ADMIN_INVITE_TOKEN` in the backend `.env`.


