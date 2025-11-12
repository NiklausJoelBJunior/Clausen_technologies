# GitHub Release Creation Guide for Clausen Desktop App

## Complete Step-by-Step Instructions

### Prerequisites
- You must have push access to: https://github.com/NiklausJoelBJunior/Clausen_technologies
- The desktop app code is ready in `/Users/user/Desktop/Clausen/clausen-desktop-app`

---

## Part 1: Build the Windows Installer

### Step 1: Open Terminal and Navigate to Project
```bash
cd /Users/user/Desktop/Clausen/clausen-desktop-app
```

### Step 2: Verify You're in the Right Directory
```bash
ls package.json
```
You should see: `package.json`

### Step 3: Build the Windows Application
```bash
npm run build:win
```

**⏱️ This will take 2-5 minutes.** You'll see output like:
```
• electron-builder  version=24.13.3
• packaging platform=win32 arch=x64
• building target=nsis file=dist/Clausen Setup 1.0.0.exe
```

**✅ Build Complete** when you see something like:
```
• building block map blockMapFile=dist/Clausen Setup 1.0.0.exe.blockmap
```

### Step 4: Verify Build Files
```bash
ls -lh dist/
```

You should see:
- `Clausen Setup 1.0.0.exe` (the installer, ~100-200 MB)
- `latest.yml` (update metadata, ~1 KB) **← CRITICAL FILE!**

---

## Part 2: Create GitHub Release

### Step 1: Go to GitHub Releases Page
Open your browser and go to:
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/new
```

### Step 2: Fill in Release Information

**Tag version:**
```
v1.0.0
```
⚠️ **Must start with 'v' and match package.json version**

**Release title:**
```
Clausen v1.0.0 - Initial Release
```

**Description:** (Copy and paste this)
```markdown
## Clausen School Management System v1.0.0

### 🎉 First Official Release

A comprehensive desktop application for school management built with Electron.

### ✨ Features

- **Role-Based Access Control**
  - Administrator
  - Bursar
  - Nurse
  - Director of Studies (DOS)
  - Teacher

- **Core Functionality**
  - Student Management
  - Teacher Management
  - Class Management
  - Attendance Tracking
  - Grade Management
  - Reports & Analytics

- **Modern UI**
  - Frameless window design
  - Custom title bar
  - Dark theme with teal accents
  - Animated loading screen

- **Auto-Update System**
  - Automatic update notifications
  - One-click update installation
  - Background downloads

### 📥 Installation

**Windows (10 or later):**
1. Download `Clausen Setup 1.0.0.exe`
2. Run the installer
3. Follow the installation wizard
4. Launch Clausen from Start Menu or Desktop

### 🔐 Demo Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Bursar | bursar | bursar123 |
| Nurse | nurse | nurse123 |
| DOS | dos | dos123 |
| Teacher | teacher | teacher123 |

### 📋 System Requirements

- **OS:** Windows 10 or later
- **RAM:** 4GB minimum
- **Disk Space:** 500MB
- **Processor:** Intel Core i3 or equivalent

### 🔄 Auto-Updates

This application includes automatic update functionality. When a new version is released, you will be notified and can update with one click.

### 🐛 Known Issues

None reported yet. Please report issues on GitHub.

---

**Developed by Clausen Technologies**
```

### Step 3: Upload Files

**Click "Attach binaries by dropping them here or selecting them"**

From `/Users/user/Desktop/Clausen/clausen-desktop-app/dist/` folder, upload:

1. ✅ `Clausen Setup 1.0.0.exe` (or similar name)
2. ✅ `latest.yml` **← DO NOT FORGET THIS FILE!**

**Why latest.yml is critical:**
- This file tells the auto-updater where to download updates
- Without it, auto-update won't work
- It's automatically generated during build

### Step 4: Choose Release Type

- ☑️ **Set as the latest release** (check this box)
- ☐ Set as a pre-release (leave unchecked)

### Step 5: Publish Release

Click the green **"Publish release"** button

---

## Part 3: Verify the Release

### Step 1: Check Release Page
Go to:
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases
```

You should see your v1.0.0 release at the top.

### Step 2: Test Download Link
The website download button uses this URL:
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/latest/download/Clausen-Setup-1.0.0.exe
```

Click it to verify it downloads the installer.

### Step 3: Test on Another Computer (Optional)
1. Download the installer on a different Windows computer
2. Install the application
3. Open it and verify it works
4. Go to Settings → Check for Updates (should say "up to date")

---

## Future Updates

### To Release Version 1.0.1 (or any future version):

1. **Update package.json:**
   ```json
   "version": "1.0.1"
   ```

2. **Build:**
   ```bash
   npm run build:win
   ```

3. **Create new release:**
   - Tag: `v1.0.1`
   - Upload new `Clausen Setup 1.0.1.exe` and `latest.yml`
   - Publish

4. **All users with v1.0.0 installed will automatically be notified of the update!**

---

## Troubleshooting

### Build fails?
- Make sure you're in the `clausen-desktop-app` folder
- Delete `node_modules` and run `npm install --cache /tmp/npm-cache`
- Try again

### Can't upload files to GitHub?
- Files must be under 2GB (our installer should be ~100-200MB)
- Make sure you're logged into GitHub
- Check you have write access to the repository

### Download link doesn't work?
- Verify the release is published (not draft)
- Check the exact filename matches the URL
- Wait a few minutes for GitHub CDN to propagate

### Auto-update not working?
- Verify `latest.yml` was uploaded with the release
- Check that the tag starts with 'v'
- Ensure version in package.json matches release tag (without 'v')

---

## Quick Reference

**Build Command:**
```bash
cd /Users/user/Desktop/Clausen/clausen-desktop-app
npm run build:win
```

**Files to Upload:**
1. `Clausen Setup 1.0.0.exe`
2. `latest.yml`

**Release URL:**
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/new

**Tag Format:**
`v` + version number (e.g., `v1.0.0`, `v1.0.1`)

---

**Need Help?** Check the AUTO-UPDATE-GUIDE.md in the clausen-desktop-app folder for more details.
