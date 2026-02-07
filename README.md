# Lite HRMS

Lite HRMS is a lightweight, full-stack Human Resource Management System designed to manage employee records and track daily attendance.  
The application focuses on clean architecture, usability, and deployment readiness, simulating a basic internal HR tool for small organizations.

---

## 🚀 Features

### Employee Management
- Add new employees with unique Employee ID
- View all employees
- Delete employees
- Server-side validation for required fields and valid email format

### Attendance Management
- Mark daily attendance (Present / Absent)
- View attendance records per employee
- Prevent invalid or duplicate entries

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLAlchemy
- SQLite

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 📂 Project Structure
```
lite-hrms/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── routers/
│   │       ├── employees.py
│   │       └── attendance.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```
---

## ⚙️ Running the Project Locally

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend will run at:
http://localhost:8000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
http://localhost:5173

---

## 🌐 Deployment
- Frontend is deployed on Vercel
- Backend API is deployed on Render
- Frontend communicates with the live backend API via environment variables

Both frontend and backend are fully deployed and publicly accessible.

---

## ⚠️ Assumptions & Limitations
- Single admin user (no authentication)
- Leave management, payroll, and advanced HR features are out of scope
- Designed for lightweight internal usage
- Focus is on stability and clean functionality rather than advanced features

---

## ✅ Status
- Core functionality complete
- Backend & frontend integrated
- Deployed and production-ready

---

## 📌 Notes
This project was built as part of a full-stack technical assessment to demonstrate:
- End-to-end application development
- API design and validation
- Database modeling
- Deployment readiness
