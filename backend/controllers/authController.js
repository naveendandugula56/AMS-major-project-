// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

// // Teacher Schema
// const teacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Teacher = mongoose.model("Teacher", teacherSchema);

// // Generate JWT
// const generateToken = (id, name, email) => {
//   return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // @POST /api/auth/register
// const registerTeacher = async (req, res) => {
//   const { name, email, password, accessCode } = req.body;

//   if (!name || !email || !password || !accessCode) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   if (accessCode !== process.env.TEACHER_ACCESS_CODE) {
//     return res.status(403).json({ message: "Invalid access code" });
//   }

//   try {
//     const exists = await Teacher.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const teacher = await Teacher.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "Account created successfully",
//       token: generateToken(teacher._id, teacher.name, teacher.email),
//       teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // @POST /api/auth/login
// const loginTeacher = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, teacher.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({
//       message: "Login successful",
//       token: generateToken(teacher._id, teacher.name, teacher.email),
//       teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = { registerTeacher, loginTeacher };




const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

/* ================= GENERATE JWT ================= */

const generateToken = (id, name, email) => {

  return jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

};


/* ================= REGISTER TEACHER ================= */

const registerTeacher = async (req, res) => {

  const {
    name,
    email,
    password,
    accessCode
  } = req.body;

  if (!name || !email || !password || !accessCode) {

    return res.status(400).json({
      message: "All fields are required"
    });

  }

  if (accessCode !== process.env.TEACHER_ACCESS_CODE) {

    return res.status(403).json({
      message: "Invalid access code"
    });

  }

  try {

    // CHECK EMAIL EXISTS

    const checkSql = `
      SELECT *
      FROM teachers
      WHERE email = ?
    `;

    db.query(checkSql, [email], async (err, result) => {

      if (err) {

        return res.status(500).json({
          message: "Database Error",
          error: err
        });

      }

      if (result.length > 0) {

        return res.status(400).json({
          message: "Email already registered"
        });

      }

      // HASH PASSWORD

      const salt = await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(password, salt);

      // INSERT TEACHER

      const insertSql = `
        INSERT INTO teachers
        (
          name,
          email,
          password
        )
        VALUES (?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          name,
          email,
          hashedPassword
        ],
        (err, result) => {

          if (err) {

            return res.status(500).json({
              message: "Insert Error",
              error: err
            });

          }

          res.status(201).json({

            message: "Account created successfully",

            token: generateToken(
              result.insertId,
              name,
              email
            ),

            teacher: {
              id: result.insertId,
              name,
              email
            }

          });

        }
      );

    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }

};


/* ================= LOGIN TEACHER ================= */

const loginTeacher = async (req, res) => {

  const {
    email,
    password
  } = req.body;

  if (!email || !password) {

    return res.status(400).json({
      message: "Email and password are required"
    });

  }

  try {

    const sql = `
      SELECT *
      FROM teachers
      WHERE email = ?
    `;

    db.query(sql, [email], async (err, result) => {

      if (err) {

        return res.status(500).json({
          message: "Database Error",
          error: err
        });

      }

      if (result.length === 0) {

        return res.status(401).json({
          message: "Invalid credentials"
        });

      }

      const teacher = result[0];

      const isMatch =
        await bcrypt.compare(
          password,
          teacher.password
        );

      if (!isMatch) {

        return res.status(401).json({
          message: "Invalid credentials"
        });

      }

      res.json({

        message: "Login successful",

        token: generateToken(
          teacher.id,
          teacher.name,
          teacher.email
        ),

        teacher: {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email
        }

      });

    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }

};

module.exports = {
  registerTeacher,
  loginTeacher
};

