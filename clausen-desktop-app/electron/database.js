const mysql = require('mysql2/promise');

// Database configuration for XAMPP MySQL
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Default XAMPP password is empty
  database: 'clausen_school',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

// Initialize database connection pool
async function initDatabase() {
  try {
    // Create connection pool
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✓ Connected to MySQL database successfully');
    connection.release();
    
    // Create tables if they don't exist
    await createTables();
    
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.log('Make sure XAMPP MySQL is running and database "clausen_school" exists');
    return false;
  }
}

// Create necessary tables
async function createTables() {
  const createStudentsTable = `
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createAttendanceTable = `
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
      remarks TEXT,
      marked_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
      UNIQUE KEY unique_attendance (student_id, date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createTeachersTable = `
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.execute(createStudentsTable);
    await pool.execute(createAttendanceTable);
    await pool.execute(createTeachersTable);
    console.log('✓ Database tables created/verified successfully');
  } catch (error) {
    console.error('✗ Error creating tables:', error.message);
    throw error;
  }
}

// Student CRUD operations
const studentOperations = {
  // Add new student
  async addStudent(studentData) {
    const query = `
      INSERT INTO students (
        student_id, first_name, last_name, middle_name, date_of_birth, 
        gender, class, section, admission_date, blood_group, email, phone, 
        address, parent_name, parent_phone, parent_email, emergency_contact, 
        medical_conditions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      studentData.student_id,
      studentData.first_name,
      studentData.last_name,
      studentData.middle_name || null,
      studentData.date_of_birth,
      studentData.gender,
      studentData.class,
      studentData.section || null,
      studentData.admission_date,
      studentData.blood_group || null,
      studentData.email || null,
      studentData.phone || null,
      studentData.address || null,
      studentData.parent_name,
      studentData.parent_phone,
      studentData.parent_email || null,
      studentData.emergency_contact || null,
      studentData.medical_conditions || null,
      studentData.status || 'Active'
    ];

    try {
      const [result] = await pool.execute(query, values);
      return { success: true, id: result.insertId, message: 'Student added successfully' };
    } catch (error) {
      console.error('Error adding student:', error);
      return { success: false, message: error.message };
    }
  },

  // Get all students
  async getAllStudents(filters = {}) {
    let query = 'SELECT * FROM students WHERE 1=1';
    const values = [];

    if (filters.class) {
      query += ' AND class = ?';
      values.push(filters.class);
    }

    if (filters.status) {
      query += ' AND status = ?';
      values.push(filters.status);
    }

    if (filters.search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR student_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    try {
      const [rows] = await pool.execute(query, values);
      return { success: true, data: rows };
    } catch (error) {
      console.error('Error fetching students:', error);
      return { success: false, message: error.message };
    }
  },

  // Get student by ID
  async getStudentById(studentId) {
    const query = 'SELECT * FROM students WHERE student_id = ?';
    try {
      const [rows] = await pool.execute(query, [studentId]);
      return { success: true, data: rows[0] || null };
    } catch (error) {
      console.error('Error fetching student:', error);
      return { success: false, message: error.message };
    }
  },

  // Update student
  async updateStudent(studentId, studentData) {
    const updates = [];
    const values = [];

    Object.keys(studentData).forEach(key => {
      if (studentData[key] !== undefined && key !== 'student_id') {
        updates.push(`${key} = ?`);
        values.push(studentData[key]);
      }
    });

    if (updates.length === 0) {
      return { success: false, message: 'No fields to update' };
    }

    values.push(studentId);
    const query = `UPDATE students SET ${updates.join(', ')} WHERE student_id = ?`;

    try {
      const [result] = await pool.execute(query, values);
      return { success: true, affected: result.affectedRows, message: 'Student updated successfully' };
    } catch (error) {
      console.error('Error updating student:', error);
      return { success: false, message: error.message };
    }
  },

  // Delete student
  async deleteStudent(studentId) {
    const query = 'DELETE FROM students WHERE student_id = ?';
    try {
      const [result] = await pool.execute(query, [studentId]);
      return { success: true, affected: result.affectedRows, message: 'Student deleted successfully' };
    } catch (error) {
      console.error('Error deleting student:', error);
      return { success: false, message: error.message };
    }
  },

  // Get student count by class
  async getStudentStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) as male,
        SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) as female
      FROM students
    `;
    try {
      const [rows] = await pool.execute(query);
      return { success: true, data: rows[0] };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, message: error.message };
    }
  },

  // Update student fingerprint
  async updateFingerprint(studentId, fingerprintData) {
    const query = `
      UPDATE students 
      SET fingerprint_data = ?, fingerprint_enrolled = TRUE 
      WHERE student_id = ?
    `;
    try {
      const [result] = await pool.execute(query, [fingerprintData, studentId]);
      return { success: true, affected: result.affectedRows, message: 'Fingerprint enrolled successfully' };
    } catch (error) {
      console.error('Error updating fingerprint:', error);
      return { success: false, message: error.message };
    }
  },

  // Get student by fingerprint
  async getStudentByFingerprint(fingerprintData) {
    const query = 'SELECT * FROM students WHERE fingerprint_data = ? AND fingerprint_enrolled = TRUE';
    try {
      const [rows] = await pool.execute(query, [fingerprintData]);
      return { success: true, data: rows[0] || null };
    } catch (error) {
      console.error('Error finding student by fingerprint:', error);
      return { success: false, message: error.message };
    }
  },

  // Remove student fingerprint
  async removeFingerprint(studentId) {
    const query = `
      UPDATE students 
      SET fingerprint_data = NULL, fingerprint_enrolled = FALSE 
      WHERE student_id = ?
    `;
    try {
      const [result] = await pool.execute(query, [studentId]);
      return { success: true, affected: result.affectedRows, message: 'Fingerprint removed successfully' };
    } catch (error) {
      console.error('Error removing fingerprint:', error);
      return { success: false, message: error.message };
    }
  }
};

// Close database connection
async function closeDatabase() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
}

module.exports = {
  initDatabase,
  studentOperations,
  closeDatabase,
  getPool: () => pool
};
