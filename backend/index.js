
const express = require('express');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors');
const officegen = require('officegen');

const db = require('./config/db.js');

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"]
}));

/* INSERT STUDENT */

app.post('/form/insert', (req, res) => {

    const {
        Name,
        Register_number,
        Year_of_studying,
        Branch_of_studying,
        Date_of_Birth,
        Gender,
        Community,
        Minority_Community,
        Blood_Group,
        Aadhar_number,
        Mobile_number,
        Email_id
    } = req.body;

    const sql = `
        INSERT INTO students
        (
            Name,
            Register_number,
            Year_of_studying,
            Branch_of_studying,
            Date_of_Birth,
            Gender,
            Community,
            Minority_Community,
            Blood_Group,
            Aadhar_number,
            Mobile_number,
            Email_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [
            Name,
            Register_number,
            Year_of_studying,
            Branch_of_studying,
            Date_of_Birth,
            Gender,
            Community,
            Minority_Community,
            Blood_Group,
            Aadhar_number,
            Mobile_number,
            Email_id
        ],
        (err, result) => {

            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Student Added Successfully");
            }

        });

});

/* READ STUDENTS */

app.get('/read', (req, res) => {

    db.query(
        "SELECT * FROM students",
        (err, result) => {

            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }

        }
    );

});

/* DELETE STUDENT */

app.delete('/remove/delete/:registerNumber', (req, res) => {

    const sql = `
        DELETE FROM students
        WHERE Register_number = ?
    `;

    db.query(
        sql,
        [req.params.registerNumber],
        (err, result) => {

            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Student Deleted");
            }

        }
    );

});

/* ATTENDANCE */

app.post('/attendance', (req, res) => {

    const attendanceData = req.body.attendanceData;

    const currentDate = new Date()
        .toISOString()
        .split('T')[0];

    attendanceData.forEach((data) => {

        const sql = `
            INSERT INTO attendance
            (
                attendance_date,
                student_id,
                attendance_status
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [
                currentDate,
                data.studentId,
                data.attendance
            ]
        );

    });

    res.send("Attendance Recorded");

});

/* SERVER */

app.listen(3031, () => {
    console.log("Server Running");
});
