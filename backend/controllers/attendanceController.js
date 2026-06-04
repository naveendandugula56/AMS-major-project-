// const mongoose = require("mongoose");

// // ─── Student Data ─────────────────────────────────────────────────────────────
// const CLASSES = {
//   "DnC Basic": [
//     "Aarav Sharma",
//     "Priya Verma",
//     "Rohit Gupta",
//     "Sneha Patel",
//     "Karan Mehta",
//     "Divya Singh",
//     "Arjun Yadav",
//     "Nisha Joshi",
//     "Vikram Tiwari",
//     "Pooja Mishra",
//   ],
//   "DnC Adv": [
//     "Rahul Kumar",
//     "Anjali Dubey",
//     "Siddharth Rao",
//     "Meera Nair",
//     "Aditya Pandey",
//     "Shruti Agarwal",
//     "Abhishek Sen",
//     "Kavya Reddy",
//     "Nikhil Jain",
//     "Ritika Bhatt",
//   ],
//   "2nd Years": [
//     "Sumit Chauhan",
//     "Priyanka Bansal",
//     "Mohit Srivastava",
//     "Deepika Khanna",
//     "Gaurav Saxena",
//     "Swati Tripathi",
//     "Rajesh Bhatia",
//     "Pallavi Kulkarni",
//     "Vivek Malhotra",
//     "Tanvi Kapoor",
//   ],
// };

// // ─── Attendance Schema ────────────────────────────────────────────────────────
// const attendanceSchema = new mongoose.Schema({
//   date: { type: String, required: true },      // "YYYY-MM-DD"
//   className: { type: String, required: true },
//   records: [
//     {
//       studentName: { type: String, required: true },
//       status: { type: String, enum: ["present", "absent"], required: true },
//     },
//   ],
//   markedBy: { type: String, required: true },  // teacher name
//   createdAt: { type: Date, default: Date.now },
// });

// attendanceSchema.index({ date: 1, className: 1 }, { unique: true });

// const Attendance = mongoose.model("Attendance", attendanceSchema);

// // ─── GET /api/attendance/classes ──────────────────────────────────────────────
// const getClasses = (req, res) => {
//   res.json({ classes: Object.keys(CLASSES) });
// };

// // ─── GET /api/attendance/students/:className ──────────────────────────────────
// const getStudents = (req, res) => {
//   const { className } = req.params;
//   const students = CLASSES[className];
//   if (!students) {
//     return res.status(404).json({ message: "Class not found" });
//   }
//   res.json({ className, students });
// };

// // ─── POST /api/attendance/mark  (protected) ───────────────────────────────────
// const markAttendance = async (req, res) => {
//   const { date, className, records } = req.body;

//   if (!date || !className || !records || !Array.isArray(records)) {
//     return res.status(400).json({ message: "date, className and records are required" });
//   }

//   if (!CLASSES[className]) {
//     return res.status(404).json({ message: "Class not found" });
//   }

//   try {
//     // Upsert: if attendance already exists for this date+class, overwrite it
//     const attendance = await Attendance.findOneAndUpdate(
//       { date, className },
//       { date, className, records, markedBy: req.teacher.name },
//       { upsert: true, new: true, runValidators: true }
//     );

//     res.status(200).json({ message: "Attendance saved successfully", attendance });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ─── GET /api/attendance/history/:className/:date  (public) ──────────────────
// const getAttendanceByDate = async (req, res) => {
//   const { className, date } = req.params;

//   try {
//     const attendance = await Attendance.findOne({ className, date });
//     if (!attendance) {
//       return res.status(404).json({ message: "No attendance record found for this date and class" });
//     }
//     res.json(attendance);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ─── GET /api/attendance/history/:className  (public) ────────────────────────
// const getClassHistory = async (req, res) => {
//   const { className } = req.params;

//   if (!CLASSES[className]) {
//     return res.status(404).json({ message: "Class not found" });
//   }

//   try {
//     const records = await Attendance.find({ className }).sort({ date: -1 });
//     res.json({ className, totalSessions: records.length, records });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // ─── GET /api/attendance/percentage/:className  (public) ─────────────────────
// const getAttendancePercentage = async (req, res) => {
//   const { className } = req.params;
//   const students = CLASSES[className];

//   if (!students) {
//     return res.status(404).json({ message: "Class not found" });
//   }

//   try {
//     const allRecords = await Attendance.find({ className });
//     const totalSessions = allRecords.length;

//     if (totalSessions === 0) {
//       return res.json({
//         className,
//         totalSessions: 0,
//         students: students.map((name) => ({ name, present: 0, absent: 0, percentage: 0 })),
//       });
//     }

//     const stats = {};
//     students.forEach((name) => {
//       stats[name] = { present: 0, absent: 0 };
//     });

//     allRecords.forEach((session) => {
//       session.records.forEach(({ studentName, status }) => {
//         if (stats[studentName]) {
//           stats[studentName][status]++;
//         }
//       });
//     });

//     const result = students.map((name) => ({
//       name,
//       present: stats[name].present,
//       absent: stats[name].absent,
//       percentage: totalSessions > 0
//         ? Math.round((stats[name].present / totalSessions) * 100)
//         : 0,
//     }));

//     res.json({ className, totalSessions, students: result });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = {
//   getClasses,
//   getStudents,
//   markAttendance,
//   getAttendanceByDate,
//   getClassHistory,
//   getAttendancePercentage,
// };



const db = require("../config/db");

// ─── Student Data ─────────────────────────────────────────────

const CLASSES = {

  "DnC Basic": [
    "Aarav Sharma",
    "Priya Verma",
    "Rohit Gupta",
    "Sneha Patel",
    "Karan Mehta"
  ],

  "DnC Adv": [
    "Rahul Kumar",
    "Anjali Dubey",
    "Siddharth Rao",
    "Meera Nair",
    "Aditya Pandey"
  ],

  "2nd Years": [
    "Sumit Chauhan",
    "Priyanka Bansal",
    "Mohit Srivastava",
    "Deepika Khanna",
    "Gaurav Saxena"
  ]

};


// ─── GET CLASSES ─────────────────

const getClasses = (req, res) => {

  res.json({
    classes: Object.keys(CLASSES)
  });

};


// ─── GET STUDENTS ─────────────────

const getStudents = (req, res) => {

  const { className } = req.params;

  const students = CLASSES[className];

  if (!students) {

    return res.status(404).json({
      message: "Class not found"
    });

  }

  res.json({
    className,
    students
  });

};


// ─── MARK ATTENDANCE ─────────────────────────────────────────

const markAttendance = (req, res) => {

  const {
    date,
    className,
    records
  } = req.body;

  if (!date || !className || !records) {

    return res.status(400).json({
      message: "date, className and records are required"
    });

  }

  records.forEach((record) => {

    const sql = `
      INSERT INTO attendance
      (
        attendance_date,
        class_name,
        student_name,
        attendance_status,
        marked_by
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        date,
        className,
        record.studentName,
        record.status,
        req.teacher?.name || "Teacher"
      ],
      (err, result) => {

        if (err) {
          console.log(err);
        }

      }
    );

  });

  res.status(200).json({
    message: "Attendance saved successfully"
  });

};


// ─── GET ATTENDANCE BY DATE ─────────────────────────────────

const getAttendanceByDate = (req, res) => {

  const { className, date } = req.params;

  const sql = `
    SELECT *
    FROM attendance
    WHERE class_name = ?
    AND attendance_date = ?
  `;

  db.query(
    sql,
    [className, date],
    (err, result) => {

      if (err) {

        res.status(500).json({
          message: "Server error",
          error: err
        });

      } else {

        if (result.length === 0) {

          return res.status(404).json({
            message: "No attendance record found"
          });

        }

        res.json(result);

      }

    }
  );

};


// ─── GET CLASS HISTORY ──────────────────────────────────────

const getClassHistory = (req, res) => {

  const { className } = req.params;

  const sql = `
    SELECT *
    FROM attendance
    WHERE class_name = ?
    ORDER BY attendance_date DESC
  `;

  db.query(
    sql,
    [className],
    (err, result) => {

      if (err) {

        res.status(500).json({
          message: "Server error",
          error: err
        });

      } else {

        res.json({
          className,
          totalSessions: result.length,
          records: result
        });

      }

    }
  );

};


// ─── GET ATTENDANCE PERCENTAGE ──────────────────────────────

const getAttendancePercentage = (req, res) => {

  const { className } = req.params;

  const students = CLASSES[className];

  if (!students) {

    return res.status(404).json({
      message: "Class not found"
    });

  }

  const sql = `
    SELECT *
    FROM attendance
    WHERE class_name = ?
  `;

  db.query(
    sql,
    [className],
    (err, result) => {

      if (err) {

        return res.status(500).json({
          message: "Server error",
          error: err
        });

      }

      const totalSessions =
        [...new Set(result.map(r => r.attendance_date))]
        .length;

      const stats = {};

      students.forEach((name) => {

        stats[name] = {
          present: 0,
          absent: 0
        };

      });

      result.forEach((record) => {

        if (stats[record.student_name]) {

          stats[record.student_name]
            [record.attendance_status]++;

        }

      });

      const finalResult = students.map((name) => ({

        name,

        present: stats[name].present,

        absent: stats[name].absent,

        percentage:
          totalSessions > 0
            ? Math.round(
                (stats[name].present / totalSessions) * 100
              )
            : 0

      }));

      res.json({
        className,
        totalSessions,
        students: finalResult
      });

    }
  );

};


module.exports = {
  getClasses,
  getStudents,
  markAttendance,
  getAttendanceByDate,
  getClassHistory,
  getAttendancePercentage,
};