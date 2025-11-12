# How to Release an Update (Auto-Update Guide)

## ✅ Your Auto-Update System is READY!

Users who installed v1.0.0 will **automatically receive updates** when you release new versions.

---

## 🚀 Steps to Release v1.1.0 (Current Changes)

### Step 1: Build the New Version

```bash
cd /Users/user/Desktop/Clausen/clausen-desktop-app
npm run build:win
```

**⏱️ Wait time**: 2-5 minutes  
**Result**: Creates files in `dist/` folder:
- `Clausen Setup 1.1.0.exe` (~77 MB)
- `latest.yml` (CRITICAL - needed for auto-updates!)

---

### Step 2: Go to GitHub Releases

1. Visit: https://github.com/NiklausJoelBJunior/Clausen_technologies/releases
2. Click **"Draft a new release"**

---

### Step 3: Create the Release

**Tag version**: `v1.1.0`  
**Release title**: `v1.1.0 - Admin Dashboard & Professional Icons`

**Description** (copy this):
```markdown
## 🎉 What's New in v1.1.0

### New Features
✅ **Complete Admin Dashboard** - Manage students and employees with ease
✅ **Student Management** - View all students, register new students, search and filter
✅ **Employee Management** - Register and manage all staff members
✅ **Attendance Tracking** - Track attendance for both students and employees with real-time statistics
✅ **Professional Icons** - Replaced emojis with clean SVG icons throughout the app

### Students Management
- View all students in interactive table
- Register new students with detailed forms
- Search by name, ID, or class
- Filter by grade (1-10)
- Edit and delete student records
- Pre-loaded with sample data

### Employees Management
- View all employees in interactive table
- Register new employees (teachers, admin staff, nurses, etc.)
- Search by name, ID, or department
- Filter by department
- Edit and delete employee records

### Attendance Tracking
- **Student Attendance**: Mark individual or all students (Present/Absent/Late)
- **Employee Attendance**: Track staff attendance by department
- Real-time statistics (present count, absent count, late count, attendance percentage)
- Date picker for any date
- Notes field for special circumstances
- Auto-fill time stamps

### UI Improvements
- Replaced all emoji icons with professional SVG icons
- Better navigation icons in sidebar
- Improved action buttons in tables
- Consistent icon sizing and styling
- Enhanced dark theme with teal accents

### Sample Data
Pre-loaded with 5 students and 4 employees for testing purposes.

---

## 📥 Download

Click on the installer below to download.

**File size**: ~77 MB  
**Platform**: Windows  
**Auto-update**: Yes ✅

---

## 🔄 For Existing Users

If you have v1.0.0 installed:
- Your app will **automatically detect** this update
- You'll see a notification when you open the app
- Update downloads in the background
- Just restart when prompted!

---

## 📚 Documentation

- [Quick Start Guide](https://github.com/NiklausJoelBJunior/Clausen_technologies/blob/main/QUICK-START-GUIDE.md)
- [Admin Dashboard Features](https://github.com/NiklausJoelBJunior/Clausen_technologies/blob/main/ADMIN-DASHBOARD-FEATURES.md)
```

---

### Step 4: Upload Files

**CRITICAL**: Upload BOTH files from the `dist/` folder:

1. **Drag and drop** `Clausen Setup 1.1.0.exe`
2. **Drag and drop** `latest.yml`

⚠️ **Without `latest.yml`, auto-updates won't work!**

---

### Step 5: Publish Release

1. ✅ **Uncheck** "Set as a pre-release"
2. ✅ **Check** "Set as the latest release"
3. Click **"Publish release"**

---

## 🎯 What Happens Next?

### For New Users:
- Download from your website: https://niklausjoelbjunior.github.io/Clausen_technologies/
- **Update the download link** to point to v1.1.0

### For Existing Users (Auto-Update):
1. User opens their installed app (v1.0.0)
2. App checks GitHub on startup
3. Finds v1.1.0 is available
4. Shows notification: "Update available"
5. Downloads in background
6. User clicks "Restart to update"
7. App updates to v1.1.0 automatically!

---

## 🔧 Update the Website Download Link

After publishing the release, update your website:

**File**: `/Users/user/Desktop/Clausen/index.html`

**Change the download URL from**:
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/latest/download/Clausen.Setup.1.0.0.exe
```

**To**:
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/latest/download/Clausen.Setup.1.1.0.exe
```

Then commit and push to update GitHub Pages.

---

## 📋 Future Updates Checklist

Every time you want to release an update:

- [ ] 1. Make your code changes
- [ ] 2. Test the app (`npm start`)
- [ ] 3. Update version in `package.json` (1.1.0 → 1.2.0)
- [ ] 4. Commit and push changes to GitHub
- [ ] 5. Build the app (`npm run build:win`)
- [ ] 6. Create new GitHub release with new version tag
- [ ] 7. Upload BOTH files (installer + latest.yml)
- [ ] 8. Publish as latest release
- [ ] 9. Update website download link (optional)
- [ ] 10. Existing users get auto-update! 🎉

---

## 🔍 How Auto-Update Works Technically

### In Your App (`main.js`):

```javascript
const { autoUpdater } = require('electron-updater');

// On app start, check for updates
autoUpdater.checkForUpdatesAndNotify();

// When update is found
autoUpdater.on('update-available', () => {
  // Shows notification to user
});

// When update is downloaded
autoUpdater.on('update-downloaded', () => {
  // Prompts user to restart
});
```

### The `latest.yml` File:
This file tells the app:
- What version is latest (1.1.0)
- Where to download it from (GitHub release URL)
- File size and checksums
- Release date

**Example `latest.yml`**:
```yaml
version: 1.1.0
files:
  - url: Clausen.Setup.1.1.0.exe
    sha512: [checksum]
    size: 80654321
path: Clausen.Setup.1.1.0.exe
sha512: [checksum]
releaseDate: '2024-11-12T10:30:00.000Z'
```

---

## ⚙️ Settings in `package.json`

```json
"build": {
  "publish": [
    {
      "provider": "github",
      "owner": "NiklausJoelBJunior",
      "repo": "Clausen_technologies"
    }
  ]
}
```

This tells electron-builder:
- Where to check for updates (GitHub)
- Which repository to use
- How to generate the `latest.yml` file

---

## 🚨 Troubleshooting

### Users Not Getting Updates?

1. **Check `latest.yml` uploaded**: Must be in GitHub release
2. **Check release is "latest"**: Not pre-release
3. **Check version number**: Must be higher (1.1.0 > 1.0.0)
4. **Check internet**: App needs internet to check for updates

### Build Failed?

```bash
# Clear cache and rebuild
cd /Users/user/Desktop/Clausen/clausen-desktop-app
rm -rf dist/
rm -rf node_modules/
npm install
npm run build:win
```

---

## 📊 Version History

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| v1.0.0 | Initial | Basic app, login system, auto-update setup |
| v1.1.0 | Nov 2024 | Admin dashboard, student/employee management, attendance tracking, SVG icons |

---

## 🎓 Best Practices

1. **Always increment version**: 1.0.0 → 1.1.0 → 1.2.0
2. **Test before release**: Run `npm start` to test locally
3. **Keep changelog**: Document what's new in each release
4. **Upload latest.yml**: Critical for auto-updates
5. **Mark as latest**: Don't use pre-release for production
6. **Update website**: Keep download link current for new users

---

## 🔐 Security Note

The auto-update system:
- ✅ Verifies file integrity using checksums
- ✅ Uses HTTPS for downloads
- ✅ Only updates from your official GitHub repository
- ✅ Requires user confirmation before installing

---

**Ready to release v1.1.0?** Follow the steps above! 🚀

Your users will automatically get the admin dashboard, student management, employee management, attendance tracking, and professional icons!
