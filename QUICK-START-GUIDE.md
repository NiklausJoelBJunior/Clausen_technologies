# Clausen School Management System - Quick Start Guide

## 🚀 Getting Started

### First Time Setup
1. Download the installer from: https://niklausjoelbjunior.github.io/Clausen_technologies/
2. Run `Clausen Setup 1.0.0.exe` (Windows)
3. Wait for installation to complete
4. Launch "Clausen" from Start Menu or Desktop

### Login Credentials (Demo)

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Bursar | bursar | bursar123 |
| Nurse | nurse | nurse123 |
| DOS | dos | dos123 |
| Teacher | teacher | teacher123 |

---

## 📚 Admin Dashboard Features

### 1️⃣ Students Management

**How to Add a Student:**
1. Click **"Students"** in the left sidebar
2. Click the **"+ Add New Student"** button (top right)
3. Fill in the form:
   - Full Name
   - Date of Birth
   - Select Class (Grade 1-10)
   - Select Gender
   - Guardian Name
   - Guardian Contact (+256 format)
   - Address (optional)
   - Medical Notes (optional)
4. Click **"Add Student"**
5. Success! The student appears in the table

**How to Search Students:**
- Type in the search box at the top
- Search works for: Name, Student ID, or Class
- Results update instantly

**How to Filter by Class:**
- Use the "All Classes" dropdown
- Select specific grade (Grade 1-10)
- Table updates automatically

**How to Manage Students:**
- 👁️ **View**: Click to see full student details
- ✏️ **Edit**: Click to modify student information
- 🗑️ **Delete**: Click to remove (asks for confirmation)

---

### 2️⃣ Employees Management

**How to Add an Employee:**
1. Click **"Teachers"** in the left sidebar
2. Click the **"+ Add New Employee"** button
3. Fill in the form:
   - Full Name
   - Email (e.g., name@clausen.edu)
   - Select Role (Teacher, Admin, Bursar, Nurse, DOS, Support)
   - Select Department (Teaching, Admin, Support, Medical)
   - Phone Number
   - Date of Hire
   - Address (optional)
   - Qualifications (optional)
4. Click **"Add Employee"**
5. Success! The employee appears in the table

**How to Search Employees:**
- Type in the search box
- Search works for: Name, Employee ID, or Department
- Instant filtering

**How to Filter by Department:**
- Use the "All Departments" dropdown
- Select: Teaching, Administration, Support, or Medical
- Table updates automatically

---

### 3️⃣ Attendance Tracking

**How to Mark Student Attendance:**
1. Click **"Attendance"** in the left sidebar
2. Ensure **"Student Attendance"** tab is selected
3. Select date (defaults to today)
4. Optional: Filter by specific class
5. For each student:
   - Select status: Present / Absent / Late
   - Time auto-fills (or enter manually)
   - Add notes if needed
6. OR click **"Mark All Present"** to mark everyone
7. Click **"Save Attendance"**
8. View live stats at the top:
   - Present count
   - Absent count
   - Late count
   - Attendance percentage

**How to Mark Employee Attendance:**
1. Click **"Employee Attendance"** tab
2. Select date
3. Optional: Filter by department
4. Mark each employee's status
5. Click **"Save Attendance"**
6. View real-time statistics

---

## 🎨 Interface Guide

### Sidebar Navigation
- **Dashboard** - Overview with statistics
- **Students** - Student management
- **Teachers** - Employee management
- **Classes** - Class management (coming soon)
- **Attendance** - Attendance tracking
- **Grades** - Grade management (coming soon)
- **Reports** - Generate reports (coming soon)
- **Settings** - App settings and updates

### Color Indicators

| Color | Meaning |
|-------|---------|
| 🟢 Green (Active) | Student/Employee is active |
| 🔴 Red (Inactive) | Student/Employee is inactive |
| 🟢 Green (Present) | Marked as present |
| 🔴 Red (Absent) | Marked as absent |
| 🟡 Yellow (Late) | Marked as late |
| 💚 Teal (#25fead) | Clausen brand color, interactive elements |

---

## 💡 Tips & Tricks

### Search Tips:
- Search is **case-insensitive**
- Works across multiple fields simultaneously
- Updates in **real-time** as you type
- Clear search box to see all records

### Attendance Tips:
- **Mark All Present** saves time for full attendance
- Time **auto-fills** when you select Present or Late
- Use **Notes field** for special circumstances
- Stats update **immediately** as you mark attendance
- Filter by class/department to focus on specific groups

### Form Tips:
- **Required fields** are marked with *
- Click outside modal or X button to close
- Form clears automatically after submission
- Phone numbers should use +256 format
- Emails should use @clausen.edu domain

### Data Management:
- **Delete** requires confirmation (can't be undone)
- **Export to CSV** button saves data to file
- Student/Employee IDs are **auto-generated**
- Status badges update automatically

---

## 🔄 Auto-Updates

The app checks for updates automatically. You can also:
1. Go to **Settings** (bottom of sidebar)
2. Click **"Check for Updates"**
3. If update available, you'll be notified
4. Download happens automatically
5. Restart app to apply update

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | ESC key |
| Submit Form | Enter (when in form) |
| Navigate Views | Click sidebar items |
| Search | Click search box and type |

---

## 📊 Sample Data

The app comes pre-loaded with sample data for testing:

**Students:**
- John Doe (Grade 10)
- Jane Smith (Grade 9)
- Michael Johnson (Grade 10)
- Emily Brown (Grade 8)
- Daniel Wilson (Grade 7)

**Employees:**
- Sarah Johnson (Teacher - Science)
- Robert Clarke (Teacher - Chemistry)
- Patricia Adams (Nurse)
- James Miller (Bursar)

You can delete these and add your own!

---

## 🆘 Troubleshooting

### App won't start?
- Check if antivirus is blocking it
- Run as Administrator
- Reinstall from the website

### Can't see my data?
- Data is stored in-memory currently
- Will reset when app closes
- Future version will have database

### Update not working?
- Check internet connection
- Ensure you have the latest version
- Try manual update from website

### Form won't submit?
- Check all required fields are filled
- Ensure date formats are correct
- Phone numbers should start with +256

---

## 📞 Support

For issues or questions:
- Check the `ADMIN-DASHBOARD-FEATURES.md` for detailed documentation
- Visit: https://niklausjoelbjunior.github.io/Clausen_technologies/
- GitHub: https://github.com/NiklausJoelBJunior/Clausen_technologies

---

## 🔐 Security Notes

- Never share your login credentials
- Change default passwords in production
- Keep the app updated
- Log out when not in use
- Data is currently local only

---

## 📝 Version Information

**Current Version**: 1.1.0  
**Release Date**: 2024  
**Platform**: Windows  
**Framework**: Electron  

---

## 🎯 Next Steps

1. **Add your school's students** using the Add Student form
2. **Register all employees** through the Add Employee form
3. **Start tracking attendance** daily
4. **Monitor statistics** on the dashboard
5. **Export data** regularly for backup

---

## 🌟 What's New in v1.1.0

✅ Complete student management system  
✅ Employee registration and management  
✅ Dual attendance tracking (students & employees)  
✅ Real-time search and filtering  
✅ Interactive data tables  
✅ Modal forms with validation  
✅ Attendance statistics dashboard  
✅ Sample data for quick testing  
✅ Export functionality  
✅ Dark theme with Clausen branding  

---

**Enjoy using Clausen School Management System!** 🎓

