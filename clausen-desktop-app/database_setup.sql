-- Clausen School Management System Database Setup
-- Run this SQL in phpMyAdmin (XAMPP) to create the database

-- Create database
CREATE DATABASE IF NOT EXISTS clausen_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE clausen_school;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  date_of_birth DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  class VARCHAR(50) NOT NULL,
  section VARCHAR(50),
  admission_date DATE NOT NULL,
  blood_group VARCHAR(10),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  parent_name VARCHAR(200) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  parent_email VARCHAR(100),
  emergency_contact VARCHAR(20),
  medical_conditions TEXT,
  photo_url VARCHAR(255),
  fingerprint_data TEXT,
  fingerprint_enrolled BOOLEAN DEFAULT FALSE,
  status ENUM('Active', 'Inactive', 'Graduated', 'Transferred') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_id (student_id),
  INDEX idx_class (class),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
  remarks TEXT,
  marked_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, date),
  INDEX idx_date (date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  subject VARCHAR(100),
  qualification VARCHAR(200),
  join_date DATE NOT NULL,
  status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employee_id (employee_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional)
INSERT INTO students (
  student_id, first_name, last_name, middle_name, date_of_birth, gender, 
  class, section, admission_date, blood_group, email, phone, 
  address, parent_name, parent_phone, parent_email, status
) VALUES
('STU20240001', 'John', 'Doe', 'Michael', '2010-05-15', 'Male', 'Grade 10', 'A', '2024-01-10', 'O+', 'john.doe@example.com', '+256 700 123456', 'Kampala, Uganda', 'Mary Doe', '+256 700 111111', 'mary.doe@example.com', 'Active'),
('STU20240002', 'Jane', 'Smith', 'Elizabeth', '2011-03-20', 'Female', 'Grade 9', 'B', '2024-01-10', 'A+', 'jane.smith@example.com', '+256 700 234567', 'Entebbe, Uganda', 'Bob Smith', '+256 700 222222', 'bob.smith@example.com', 'Active'),
('STU20240003', 'Michael', 'Johnson', NULL, '2010-08-12', 'Male', 'Grade 10', 'A', '2024-01-10', 'B+', 'michael.johnson@example.com', '+256 700 345678', 'Jinja, Uganda', 'Lisa Johnson', '+256 700 333333', 'lisa.johnson@example.com', 'Active');

-- Insert sample teachers (optional)
INSERT INTO teachers (
  employee_id, first_name, last_name, email, phone, 
  subject, qualification, join_date, status
) VALUES
('EMP20240001', 'Sarah', 'Williams', 'sarah.williams@clausen.edu', '+256 700 444444', 'Mathematics', 'BSc Mathematics, MEd', '2020-01-15', 'Active'),
('EMP20240002', 'David', 'Brown', 'david.brown@clausen.edu', '+256 700 555555', 'English', 'BA English Literature, PGDE', '2019-03-20', 'Active'),
('EMP20240003', 'Emily', 'Davis', 'emily.davis@clausen.edu', '+256 700 666666', 'Science', 'BSc Physics, MSc Education', '2021-08-10', 'Active');

-- Verify the database setup
SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS total_students FROM students;
SELECT COUNT(*) AS total_teachers FROM teachers;
