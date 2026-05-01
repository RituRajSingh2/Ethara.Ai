# Ethara.Ai — Team Task Manager

A full-stack Team Task Manager with JWT auth, project management, task tracking, and role-based access.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + Axios
- **Backend:** Node.js + Express.js + JWT
- **Database:** MongoDB (Mongoose)

## Project Structure

```
Ethara.Ai/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/          (User, Project, Task)
│   ├── routes/          (auth, projects, tasks, dashboard)
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  (Layout)
│   │   ├── context/     (AuthContext)
│   │   ├── pages/       (Auth, Dashboard, Projects, Tasks)
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ethara-tasks
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=/api
```

## API Endpoints

| Method | Endpoint         | Auth | Description              |
|--------|-----------------|------|--------------------------|
| POST   | /api/auth/signup | No   | Register user            |
| POST   | /api/auth/login  | No   | Login, get JWT           |
| POST   | /api/projects    | Yes  | Create project           |
| GET    | /api/projects    | Yes  | User's projects          |
| POST   | /api/tasks       | Yes  | Create task (admin only) |
| GET    | /api/tasks       | Yes  | Get tasks                |
| PUT    | /api/tasks/:id   | Yes  | Update task              |
| GET    | /api/dashboard   | Yes  | Task stats               |

## Railway Deployment

### Backend

1. Push to GitHub
2. Create new project on [Railway](https://railway.app)
3. Add a **Web Service** → connect your repo → set root to `backend`
4. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a random secret string
   - `CLIENT_URL` — your frontend Railway URL
   - `PORT` — leave blank (Railway sets it)
5. Deploy

### Frontend

1. Add another **Web Service** → connect same repo → set root to `frontend`
2. Set build command: `npm run build`
3. Set start command: `npx serve dist -s`
4. Add environment variable:
   - `VITE_API_URL` — your backend Railway URL + `/api` (e.g. `https://your-backend.up.railway.app/api`)
5. Deploy

### Alternative: Serve frontend from backend

Update `backend/server.js` to serve the built frontend:

```js
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
```

Then deploy as a single service.
