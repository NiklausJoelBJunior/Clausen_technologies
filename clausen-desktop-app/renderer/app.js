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
        this.students = [];
        this.teachers = [];
        this.classes = [];
    }

    // Student management
    addStudent(student) {
        this.students.push(student);
    }

    // Teacher management
    addTeacher(teacher) {
        this.teachers.push(teacher);
    }

    // Class management
    addClass(classInfo) {
        this.classes.push(classInfo);
    }
}

// Initialize the app
const app = new ClausenApp();
