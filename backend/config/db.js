
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Naveen12",
    database: "attendance_management_system"
});

db.connect((err) => {

    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }

});

module.exports = db;
