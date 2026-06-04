const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getClasses,
  getStudents,
  markAttendance,
  getAttendanceByDate,
  getClassHistory,
  getAttendancePercentage,
} = require("../controllers/attendanceController");

// Public routes
router.get("/classes", getClasses);
router.get("/students/:className", getStudents);
router.get("/history/:className", getClassHistory);
router.get("/history/:className/:date", getAttendanceByDate);
router.get("/percentage/:className", getAttendancePercentage);

// Protected routes (teacher only)
router.post("/mark", protect, markAttendance);

module.exports = router;
