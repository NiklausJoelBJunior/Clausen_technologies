// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.querySelector('.page-title');

    // Window controls
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            window.electronAPI.minimizeWindow();
        });
    }

    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            window.electronAPI.maximizeWindow();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.electronAPI.closeWindow();
        });
    }

    // Listen for user login data
    if (window.electronAPI && window.electronAPI.onUserLoggedIn) {
        window.electronAPI.onUserLoggedIn((userRole) => {
            updateUserInfo(userRole);
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get the view to show
            const viewName = item.getAttribute('data-view');
            
            // Hide all views
            views.forEach(view => view.classList.remove('active'));
            
            // Show the selected view
            const selectedView = document.getElementById(`${viewName}-view`);
            if (selectedView) {
                selectedView.classList.add('active');
            }
            
            // Update page title
            const titleText = item.querySelector('.label').textContent;
            pageTitle.textContent = titleText;
        });
    });

    // Get app version
    if (window.electronAPI) {
        window.electronAPI.getAppVersion().then(version => {
            console.log('App Version:', version);
        });
        
        // Load current version in settings
        window.electronAPI.getCurrentVersion().then(version => {
            const versionElement = document.getElementById('app-version');
            if (versionElement) {
                versionElement.textContent = version;
            }
        });
    }

    // Check for updates button
    const checkUpdatesBtn = document.getElementById('check-updates-btn');
    const updateStatus = document.getElementById('update-status');

    if (checkUpdatesBtn && window.electronAPI) {
        checkUpdatesBtn.addEventListener('click', async () => {
            checkUpdatesBtn.disabled = true;
            checkUpdatesBtn.textContent = 'Checking...';
            
            updateStatus.className = 'update-status show info';
            updateStatus.textContent = 'Checking for updates...';

            try {
                const result = await window.electronAPI.checkForUpdates();
                
                if (result.success) {
                    updateStatus.className = 'update-status show success';
                    updateStatus.textContent = 'Check complete! If an update is available, you will be notified.';
                } else {
                    updateStatus.className = 'update-status show error';
                    updateStatus.textContent = `Error: ${result.error}`;
                }
            } catch (error) {
                updateStatus.className = 'update-status show error';
                updateStatus.textContent = 'Failed to check for updates. Please try again later.';
            }

            checkUpdatesBtn.disabled = false;
            checkUpdatesBtn.textContent = 'Check for Updates';

            setTimeout(() => {
                updateStatus.classList.remove('show');
            }, 5000);
        });

        // Listen for download progress
        if (window.electronAPI.onDownloadProgress) {
            window.electronAPI.onDownloadProgress((progress) => {
                updateStatus.className = 'update-status show info';
                updateStatus.textContent = `Downloading update: ${Math.round(progress.percent)}%`;
            });
        }
    }
});

// Update user info based on logged-in role
function updateUserInfo(userRole) {
    const userRoleElement = document.getElementById('user-role');
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');

    if (userRoleElement) userRoleElement.textContent = userRole;
    
    const roleNames = {
        'Administrator': { name: 'Admin User', initial: 'A' },
        'Bursar': { name: 'Bursar User', initial: 'B' },
        'Nurse': { name: 'Nurse User', initial: 'N' },
        'DOS': { name: 'DOS User', initial: 'D' },
        'Teacher': { name: 'Teacher User', initial: 'T' }
    };

    const userInfo = roleNames[userRole] || { name: 'User', initial: 'U' };
    
    if (userNameElement) userNameElement.textContent = userInfo.name;
    if (userAvatarElement) userAvatarElement.textContent = userInfo.initial;
}

// Add sample data management functions here
class ClausenApp {
    constructor() {
        this.students = this.loadSampleStudents();
        this.employees = this.loadSampleEmployees();
        this.attendance = {
            students: [],
            employees: []
        };
        this.init();
    }

    loadSampleStudents() {
        return [
            { id: 'STU001', name: 'John Doe', class: 'Grade 10', dob: '2010-05-15', guardian: 'Mary Doe', contact: '+256 700 123456', status: 'active', gender: 'male', address: 'Kampala, Uganda', medical: 'None' },
            { id: 'STU002', name: 'Jane Smith', class: 'Grade 9', dob: '2011-03-20', guardian: 'Bob Smith', contact: '+256 700 234567', status: 'active', gender: 'female', address: 'Entebbe, Uganda', medical: 'Allergic to peanuts' },
            { id: 'STU003', name: 'Michael Johnson', class: 'Grade 10', dob: '2010-08-12', guardian: 'Lisa Johnson', contact: '+256 700 345678', status: 'active', gender: 'male', address: 'Jinja, Uganda', medical: 'None' },
            { id: 'STU004', name: 'Emily Brown', class: 'Grade 8', dob: '2012-01-25', guardian: 'David Brown', contact: '+256 700 456789', status: 'active', gender: 'female', address: 'Mbarara, Uganda', medical: 'Asthma' },
            { id: 'STU005', name: 'Daniel Wilson', class: 'Grade 7', dob: '2013-11-08', guardian: 'Sarah Wilson', contact: '+256 700 567890', status: 'active', gender: 'male', address: 'Kampala, Uganda', medical: 'None' }
        ];
    }

    loadSampleEmployees() {
        return [
            { id: 'EMP001', name: 'Sarah Johnson', role: 'Teacher', department: 'Teaching', email: 'sarah.j@clausen.edu', phone: '+256 700 234567', status: 'active', hireDate: '2020-01-15', qualifications: 'BSc Education, MSc Mathematics' },
            { id: 'EMP002', name: 'Robert Clarke', role: 'Teacher', department: 'Teaching', email: 'robert.c@clausen.edu', phone: '+256 700 345678', status: 'active', hireDate: '2019-08-20', qualifications: 'BSc Chemistry, PhD Education' },
            { id: 'EMP003', name: 'Patricia Adams', role: 'Nurse', department: 'Medical', email: 'patricia.a@clausen.edu', phone: '+256 700 456789', status: 'active', hireDate: '2021-03-10', qualifications: 'BSc Nursing, RN License' },
            { id: 'EMP004', name: 'James Miller', role: 'Bursar', department: 'Administration', email: 'james.m@clausen.edu', phone: '+256 700 567890', status: 'active', hireDate: '2018-05-12', qualifications: 'BSc Accounting, CPA' }
        ];
    }

    init() {
        this.setupModals();
        this.setupTables();
        this.setupAttendance();
        this.setupForms();
        this.setupSearch();
    }

    setupModals() {
        // Modal open buttons
        const addStudentBtn = document.getElementById('add-student-btn');
        const addEmployeeBtn = document.getElementById('add-employee-btn');

        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => this.openModal('add-student-modal'));
        }

        if (addEmployeeBtn) {
            addEmployeeBtn.addEventListener('click', () => this.openModal('add-employee-modal'));
        }

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.closeModal(modalId);
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }

    setupTables() {
        this.renderStudentsTable();
        this.renderEmployeesTable();
    }

    renderStudentsTable(filter = '') {
        const tbody = document.getElementById('students-table-body');
        if (!tbody) return;

        let filteredStudents = this.students;
        
        if (filter) {
            filteredStudents = this.students.filter(s => 
                s.name.toLowerCase().includes(filter.toLowerCase()) ||
                s.id.toLowerCase().includes(filter.toLowerCase()) ||
                s.class.toLowerCase().includes(filter.toLowerCase())
            );
        }

        tbody.innerHTML = filteredStudents.map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.dob}</td>
                <td>${student.guardian}</td>
                <td>${student.contact}</td>
                <td><span class="status-badge ${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></td>
                <td class="actions">
                    <button class="btn-icon" title="View" onclick="app.viewStudent('${student.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="btn-icon" title="Edit" onclick="app.editStudent('${student.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon" title="Delete" onclick="app.deleteStudent('${student.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderEmployeesTable(filter = '') {
        const tbody = document.getElementById('employees-table-body');
        if (!tbody) return;

        let filteredEmployees = this.employees;
        
        if (filter) {
            filteredEmployees = this.employees.filter(e => 
                e.name.toLowerCase().includes(filter.toLowerCase()) ||
                e.id.toLowerCase().includes(filter.toLowerCase()) ||
                e.department.toLowerCase().includes(filter.toLowerCase())
            );
        }

        tbody.innerHTML = filteredEmployees.map(employee => `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.role}</td>
                <td>${employee.department}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td><span class="status-badge ${employee.status}">${employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}</span></td>
                <td class="actions">
                    <button class="btn-icon" title="View" onclick="app.viewEmployee('${employee.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button class="btn-icon" title="Edit" onclick="app.editEmployee('${employee.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon" title="Delete" onclick="app.deleteEmployee('${employee.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    setupAttendance() {
        // Set today's date
        const dateInput = document.getElementById('attendance-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
            dateInput.addEventListener('change', () => this.updateAttendanceView());
        }

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Attendance controls
        const markAllPresent = document.getElementById('mark-all-present');
        const markAllEmployeesPresent = document.getElementById('mark-all-employees-present');

        if (markAllPresent) {
            markAllPresent.addEventListener('click', () => this.markAllPresent('students'));
        }

        if (markAllEmployeesPresent) {
            markAllEmployeesPresent.addEventListener('click', () => this.markAllPresent('employees'));
        }

        this.updateAttendanceView();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName)?.classList.add('active');
    }

    updateAttendanceView() {
        const classFilter = document.getElementById('attendance-class-filter');
        const selectedClass = classFilter?.value || '';

        let studentsToShow = this.students;
        if (selectedClass) {
            studentsToShow = this.students.filter(s => s.class.toLowerCase().replace(' ', '-') === selectedClass);
        }

        this.renderAttendanceTable('students', studentsToShow);
        this.renderAttendanceTable('employees', this.employees);
    }

    renderAttendanceTable(type, data) {
        const tbody = document.getElementById(`${type === 'students' ? 'student' : 'employee'}-attendance-body`);
        if (!tbody) return;

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${type === 'students' ? item.class : item.department}</td>
                <td>
                    <select class="filter-select" onchange="app.updateAttendanceStatus('${type}', '${item.id}', this.value)">
                        <option value="">Not Marked</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                    </select>
                </td>
                <td><input type="time" class="date-input" id="${type}-time-${item.id}"></td>
                <td><input type="text" class="search-input" placeholder="Add note..." id="${type}-note-${item.id}" style="min-width: 150px;"></td>
            </tr>
        `).join('');

        this.updateAttendanceStats(type);
    }

    updateAttendanceStatus(type, id, status) {
        // Update time automatically when marking present or late
        if (status === 'present' || status === 'late') {
            const timeInput = document.getElementById(`${type}-time-${id}`);
            if (timeInput && !timeInput.value) {
                const now = new Date();
                timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            }
        }
        this.updateAttendanceStats(type);
    }

    updateAttendanceStats(type) {
        const tbody = document.getElementById(`${type === 'students' ? 'student' : 'employee'}-attendance-body`);
        if (!tbody) return;

        const selects = tbody.querySelectorAll('select');
        let present = 0, absent = 0, late = 0;

        selects.forEach(select => {
            if (select.value === 'present') present++;
            else if (select.value === 'absent') absent++;
            else if (select.value === 'late') late++;
        });

        const total = selects.length;
        const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

        const prefix = type === 'students' ? '' : 'emp-';
        document.getElementById(`${prefix}present-count`).textContent = present;
        document.getElementById(`${prefix}absent-count`).textContent = absent;
        document.getElementById(`${prefix}late-count`).textContent = late;
        document.getElementById(`${prefix}attendance-percentage`).textContent = `${percentage}%`;
    }

    markAllPresent(type) {
        const tbody = document.getElementById(`${type === 'students' ? 'student' : 'employee'}-attendance-body`);
        if (!tbody) return;

        const selects = tbody.querySelectorAll('select');
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        selects.forEach((select, index) => {
            select.value = 'present';
            const timeInput = tbody.querySelectorAll('input[type="time"]')[index];
            if (timeInput) timeInput.value = currentTime;
        });

        this.updateAttendanceStats(type);
    }

    setupForms() {
        // Add student form
        const studentForm = document.getElementById('add-student-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudent(new FormData(studentForm));
            });
        }

        // Add employee form
        const employeeForm = document.getElementById('add-employee-form');
        if (employeeForm) {
            employeeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addEmployee(new FormData(employeeForm));
            });
        }
    }

    addStudent(formData) {
        const student = {
            id: `STU${String(this.students.length + 1).padStart(3, '0')}`,
            name: formData.get('name'),
            class: formData.get('class').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            dob: formData.get('dob'),
            guardian: formData.get('guardian'),
            contact: formData.get('contact'),
            status: 'active',
            gender: formData.get('gender'),
            address: formData.get('address') || 'N/A',
            medical: formData.get('medical') || 'None'
        };

        this.students.push(student);
        this.renderStudentsTable();
        this.closeModal('add-student-modal');
        
        // Show success message (you can enhance this with a toast notification)
        alert(`Student ${student.name} added successfully!`);
    }

    addEmployee(formData) {
        const employee = {
            id: `EMP${String(this.employees.length + 1).padStart(3, '0')}`,
            name: formData.get('name'),
            role: formData.get('role').charAt(0).toUpperCase() + formData.get('role').slice(1),
            department: formData.get('department').charAt(0).toUpperCase() + formData.get('department').slice(1),
            email: formData.get('email'),
            phone: formData.get('phone'),
            status: 'active',
            hireDate: formData.get('hireDate'),
            qualifications: formData.get('qualifications') || 'N/A'
        };

        this.employees.push(employee);
        this.renderEmployeesTable();
        this.closeModal('add-employee-modal');
        
        alert(`Employee ${employee.name} added successfully!`);
    }

    setupSearch() {
        // Student search
        const studentSearch = document.getElementById('student-search');
        if (studentSearch) {
            studentSearch.addEventListener('input', (e) => {
                this.renderStudentsTable(e.target.value);
            });
        }

        // Employee search
        const employeeSearch = document.getElementById('employee-search');
        if (employeeSearch) {
            employeeSearch.addEventListener('input', (e) => {
                this.renderEmployeesTable(e.target.value);
            });
        }

        // Class filter for attendance
        const attendanceClassFilter = document.getElementById('attendance-class-filter');
        if (attendanceClassFilter) {
            attendanceClassFilter.addEventListener('change', () => {
                this.updateAttendanceView();
            });
        }
    }

    // Placeholder methods for view/edit/delete
    viewStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            alert(`Viewing student: ${JSON.stringify(student, null, 2)}`);
        }
    }

    editStudent(id) {
        alert(`Edit functionality for student ${id} - Coming soon!`);
    }

    deleteStudent(id) {
        if (confirm(`Are you sure you want to delete student ${id}?`)) {
            this.students = this.students.filter(s => s.id !== id);
            this.renderStudentsTable();
        }
    }

    viewEmployee(id) {
        const employee = this.employees.find(e => e.id === id);
        if (employee) {
            alert(`Viewing employee: ${JSON.stringify(employee, null, 2)}`);
        }
    }

    editEmployee(id) {
        alert(`Edit functionality for employee ${id} - Coming soon!`);
    }

    deleteEmployee(id) {
        if (confirm(`Are you sure you want to delete employee ${id}?`)) {
            this.employees = this.employees.filter(e => e.id !== id);
            this.renderEmployeesTable();
        }
    }
}

// Initialize the app
const app = new ClausenApp();
