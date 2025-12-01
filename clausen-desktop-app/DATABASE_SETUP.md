# MySQL Database Setup for Clausen School Management System

## Prerequisites
- XAMPP installed on your computer
- The application uses port 3306 for MySQL (default XAMPP port)

## Setup Instructions

### Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL** (for database)
4. Wait until both services show "Running" status

### Step 2: Create Database
You have two options:

#### Option A: Using phpMyAdmin (Recommended)
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "New" in the left sidebar
3. Database name: `clausen_school`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"
6. Click on the `clausen_school` database in the left sidebar
7. Click on the "SQL" tab at the top
8. Open the file `database_setup.sql` from the project root
9. Copy all the SQL code and paste it into the SQL query box
10. Click "Go" to execute

#### Option B: Using SQL File Import
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on "New" and create database: `clausen_school`
3. Select the `clausen_school` database
4. Click on "Import" tab
5. Choose the `database_setup.sql` file
6. Click "Go"

### Step 3: Verify Database Connection
1. Open the Clausen desktop application
2. Wait for the loading screen
3. Login as admin (username: `admin`, password: `admin123`)
4. Navigate to "Students" section
5. If the database is connected, you should see:
   - No connection error message
   - "Add New Student" button enabled
   - Sample students loaded (if you ran the sample data SQL)

### Step 4: Test Adding a Student
1. Click "+ Add New Student" button
2. Fill in the required fields (marked with *)
3. Click "Add Student"
4. Student should appear in the students list
5. Verify in phpMyAdmin: Students table should have the new entry

## Database Configuration

The application is configured with these default XAMPP settings:
- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: (empty)
- **Database**: clausen_school

If you changed your XAMPP MySQL password, update it in:
`electron/database.js` → Line 5: `password: ''`

## Database Tables

### Students Table
Stores all student information including:
- Personal details (name, DOB, gender, etc.)
- Academic info (class, section, admission date)
- Contact details (email, phone, address)
- Parent/guardian information
- Medical conditions
- Status (Active/Inactive/Graduated/Transferred)

### Attendance Table
Tracks daily attendance for each student:
- Student ID (foreign key)
- Date
- Status (Present/Absent/Late/Excused)
- Remarks
- Marked by (teacher/admin)

### Teachers Table
Stores teacher/employee information:
- Employee ID
- Personal details
- Subject specialization
- Qualification
- Employment status

## Troubleshooting

### Issue: "Database not connected" error
**Solutions:**
1. Make sure XAMPP MySQL is running (green in XAMPP Control Panel)
2. Verify database name is exactly `clausen_school`
3. Check phpMyAdmin is accessible at `http://localhost/phpmyadmin`
4. Restart the Electron app
5. Check console logs in the app for detailed error messages

### Issue: Cannot add students
**Solutions:**
1. Verify database tables exist in phpMyAdmin
2. Check if sample data was inserted successfully
3. Make sure Student ID is unique
4. Fill all required fields marked with *

### Issue: MySQL port already in use
**Solutions:**
1. Stop other MySQL services (MySQL Workbench, etc.)
2. Change XAMPP MySQL port in XAMPP config
3. Update the port in `electron/database.js`

### Issue: Access denied for user 'root'
**Solutions:**
1. Reset MySQL root password in XAMPP
2. Update password in `electron/database.js`
3. Grant proper privileges to root user

## Sample Data

The `database_setup.sql` includes sample data:
- 3 sample students
- 3 sample teachers

You can:
- Keep them for testing
- Delete them from phpMyAdmin
- Modify the SQL file to remove the INSERT statements

## Features

### Students Management
- ✅ Add new students with complete information
- ✅ View all students in a table
- ✅ Search students by name or ID
- ✅ Filter by class or status
- ✅ Auto-generate student IDs
- 🔄 Edit student information (coming soon)
- 🔄 Delete students (coming soon)
- 🔄 Upload student photos (coming soon)

### Database Operations
- ✅ Connection pooling for better performance
- ✅ Automatic table creation on first run
- ✅ Safe transactions with error handling
- ✅ Input validation
- ✅ SQL injection prevention

## API Reference

The app exposes these database functions via `window.electronAPI.database`:

```javascript
// Add a new student
await window.electronAPI.database.addStudent(studentData)

// Get all students (with optional filters)
await window.electronAPI.database.getStudents({ 
  search: 'John', 
  class: 'Grade 10', 
  status: 'Active' 
})

// Get single student by ID
await window.electronAPI.database.getStudent('STU20240001')

// Update student information
await window.electronAPI.database.updateStudent('STU20240001', updatedData)

// Delete a student
await window.electronAPI.database.deleteStudent('STU20240001')

// Get statistics
await window.electronAPI.database.getStats()

// Check database connection
await window.electronAPI.database.checkConnection()
```

## Security Notes

⚠️ **Important for Production:**
1. Change MySQL root password from default empty
2. Create a dedicated database user with limited privileges
3. Never commit database credentials to Git
4. Use environment variables for sensitive config
5. Implement proper user authentication
6. Enable SSL for MySQL connections
7. Regular database backups

## Backup and Restore

### Backup
1. Open phpMyAdmin
2. Select `clausen_school` database
3. Click "Export" tab
4. Choose "Quick" method
5. Format: SQL
6. Click "Go" to download

### Restore
1. Open phpMyAdmin
2. Select `clausen_school` database (or create new)
3. Click "Import" tab
4. Choose your backup .sql file
5. Click "Go"

## Support

If you encounter issues:
1. Check XAMPP control panel - MySQL should be green/running
2. Test phpMyAdmin access: `http://localhost/phpmyadmin`
3. Check app console for error messages
4. Verify database name and credentials
5. Review the SQL error messages in phpMyAdmin

For additional help, check:
- XAMPP documentation: https://www.apachefriends.org/docs/
- MySQL documentation: https://dev.mysql.com/doc/
