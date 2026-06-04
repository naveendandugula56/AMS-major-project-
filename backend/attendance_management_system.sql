
CREATE DATABASE attendance_management_system;

USE attendance_management_system;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Register_number VARCHAR(50) UNIQUE,
    Year_of_studying VARCHAR(20),
    Branch_of_studying VARCHAR(100),
    Date_of_Birth DATE,
    Gender VARCHAR(20),
    Community VARCHAR(50),
    Minority_Community VARCHAR(50),
    Blood_Group VARCHAR(20),
    Aadhar_number VARCHAR(20),
    Mobile_number VARCHAR(20),
    Email_id VARCHAR(100)
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attendance_date DATE,
    student_id INT,
    attendance_status VARCHAR(20),

    FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON DELETE CASCADE
);
