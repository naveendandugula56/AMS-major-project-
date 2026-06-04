# ⌨️ Arjun college of technology — Attendance System

A full-stack attendance management system for the Coders DnC club.

---

## 🏗️ Tech Stack

- **Backend**: Node.js, Express, MySQL, JWT
- **Frontend**: React, React Router, Axios

---

## 📁 Project Structure

```
attendance-system/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/db.js
│   ├── routes/authRoutes.js
│   ├── routes/attendanceRoutes.js
│   ├── controllers/authController.js
│   ├── controllers/attendanceController.js
│   └── middleware/authMiddleware.js
│
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── context/AuthContext.js
        ├── utils/api.js
        ├── components/Navbar.js
        └── pages/
            ├── Home.js
            ├── Login.js
            ├── Register.js
            ├── MarkAttendance.js
            ├── ViewAttendance.js
            └── History.js
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js (v16+)
- MySQL running locally 

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

---

## 🔐 Teacher Access Code

```
DnC@Coders2024
```

Change this in `backend/.env` → `TEACHER_ACCESS_CODE`

---

## 🎓 Classes & Students

| Class       | Students |
|-------------|----------|
| 1st years | 10       |
| 2nd years    | 10       |
| 3rd Years   | 10       |

Student names are hardcoded in `backend/controllers/attendanceController.js`.
To change students, edit the `CLASSES` object at the top of that file.

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register teacher (needs access code) |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/attendance/classes` | ❌ | List all classes |
| GET | `/api/attendance/students/:className` | ❌ | Students in a class |
| POST | `/api/attendance/mark` | ✅ JWT | Mark attendance |
| GET | `/api/attendance/percentage/:className` | ❌ | Attendance % per student |
| GET | `/api/attendance/history/:className` | ❌ | All sessions for a class |
| GET | `/api/attendance/history/:className/:date` | ❌ | Record for specific date |

---

## 📄 Pages

| Page | URL | Access |
|------|-----|--------|
| Home | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public (needs access code) |
| Mark Attendance | `/mark` | Teachers only |
| View Attendance | `/view` | Public |
| History | `/history` | Public |

---

## ⚙️ Environment Variables (`backend/.env`)

```env
PORT=5000
JWT_SECRET=dnc_super_secret_jwt_key_2024
TEACHER_ACCESS_CODE=DnC@Coders2024
```
