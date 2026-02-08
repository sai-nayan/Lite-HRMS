# Lite HRMS Frontend (Vite + React + Tailwind)

Minimal HR management frontend that talks to the provided backend and keeps fast, optimistic UX for attendance.

## Overview
- Employees: add/delete through backend; inline edits stay frontend-only.
- Attendance: POST-only (`/attendance`) with optimistic UI; records persist in localStorage.
- App remembers the active tab and attendance data across reloads.

## Features
- Employee management: create/delete via API; inline edit without hitting the backend.
- Attendance workflow: POST-only submission, optimistic insert, editable status (Present/Absent).
- Persistence: attendance and active tab stored in `localStorage` for reload safety.

## Tech Stack
- Vite, React, Tailwind CSS
- Axios for API requests

## Running Locally
1) Install deps: `npm install`
2) Configure backend URL in `.env` (already pointing to the live backend):
```
VITE_API_BASE_URL=https://lite-hrms-backend.onrender.com
```
3) Start dev server: `npm run dev`

## Design Decisions
- Optimistic UI for attendance keeps the UI responsive despite POST-only backend.
- localStorage is used to persist attendance records and the active tab, matching the backend’s lack of GET for attendance.

## Known Limitations
- Attendance listing is local-only (no GET); relies on the client’s stored data.
- Employee inline edits never touch the backend (frontend-only state change).

## Live Backend Reference
- Base URL: `https://lite-hrms-backend.onrender.com`

## Notes for Evaluators
- No extra dependencies beyond the stack above.
- Backend contract is unchanged: only existing endpoints are used (employees list/create/delete, attendance POST).
