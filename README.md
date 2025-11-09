# Rent & Swap — Monorepo

This repo now contains both the React frontend (Vite + TypeScript) and a Node/Express API that persists users in MongoDB. The current backend slice focuses on authentication (signup/login) so the UI can demonstrate full-stack flows.

## Requirements
- Node 18+
- npm 10+
- Local MongoDB running on `mongodb://localhost:27017` (or update the env vars)

## Environment Variables
Create the following files from the provided examples:

- Frontend: copy `.env.example` → `.env` and update `VITE_API_URL` if your API runs on a different host/port.
- Backend: inside `server/`, copy `.env.example` → `.env` and set:
  - `MONGO_URI` — connection string for MongoDB
  - `JWT_SECRET` — long random string
  - `CLIENT_ORIGIN` — normally `http://localhost:5173`

## Install
From the repo root:
```bash
npm install
cd server && npm install
```

## Development
Frontend:
```bash
npm run dev
```
Backend (from `server/`):
```bash
npm run dev
```
The API listens on `http://localhost:4000` by default and exposes `POST /api/auth/signup` and `POST /api/auth/login`. The React app reads the API base from `VITE_API_URL`, so no proxy configuration is necessary.

## Build & Production
Frontend bundle:
```bash
npm run build && npm run preview
```
Backend:
```bash
cd server
npm run build
npm start
```

## Testing the Auth Flow
1. Start MongoDB locally.
2. Run both servers as described above.
3. Visit `http://localhost:5173/signup`, create an account (email or phone + password).
4. After signup/login the UI stores the JWT in `localStorage` and redirects to the home page.

Future work (payments, listings, etc.) can build on this foundation by adding more API routes, Mongo models, and secured endpoints that verify the stored JWT.
