# Release Guide - Clausen School Management System v2.0.0

This guide will help you release the new version with fingerprint support and set up automatic updates for existing users.

## 🎯 What's New in Version 2.0.0

### Major Features Added:
- ✅ **Fingerprint Scanning Support** - Enroll student fingerprints for biometric identification
- ✅ **MySQL Database Integration** - Full student management with CRUD operations
- ✅ **Automatic Updates** - Built-in update checker and installer
- ✅ **Enhanced UI** - Improved student management interface
- ✅ **Connection Pooling** - Better database performance

### Technical Improvements:
- React 19.2.0 + Vite 7.2.2
- Tailwind CSS 3.4.0
- Electron with auto-updater
- Serial port support for fingerprint scanners
- Node-HID for USB device communication

## 📋 Prerequisites

Before releasing, ensure you have:

1. **GitHub Personal Access Token** with `repo` scope
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select `repo` scope
   - Copy the token

2. **Git Repository** up to date
   - All changes committed
   - Working directory clean

3. **Node.js and NPM** installed (v18 or higher)

4. **Electron Builder** dependencies installed

## 🚀 Release Steps

### Step 1: Set GitHub Token

For automatic publishing to work, set your GitHub token:

**macOS/Linux:**
```bash
export GH_TOKEN="your_github_personal_access_token"
```

**Windows (PowerShell):**
```powershell
$env:GH_TOKEN="your_github_personal_access_token"
```

**Windows (CMD):**
```cmd
set GH_TOKEN=your_github_personal_access_token
```

### Step 2: Commit All Changes

```bash
cd /Users/user/Desktop/Clausen
git add .
git commit -m "Release v2.0.0 - Added fingerprint support and database integration"
```

### Step 3: Create Git Tag

```bash
git tag -a v2.0.0 -m "Version 2.0.0 - Fingerprint Support"
```

### Step 4: Push to GitHub

```bash
git push origin main
git push origin v2.0.0
```

### Step 5: Build and Release

Choose based on your current OS:

**For macOS:**
```bash
cd clausen-desktop-app
npm run build:mac
```

**For Windows:**
```bash
cd clausen-desktop-app
npm run build:win
```

**For Linux:**
```bash
cd clausen-desktop-app
npm run build:linux
```

**Build for All Platforms (requires macOS):**
```bash
cd clausen-desktop-app
npm run build:all
```

This will:
1. Build the Vite frontend
2. Build Electron app
3. Create installers (DMG/NSIS/AppImage)
4. Upload to GitHub Releases automatically

### Step 6: Verify Release on GitHub

1. Go to: `https://github.com/NiklausJoelBJunior/Clausen_technologies/releases`
2. You should see "v2.0.0" release
3. Download links for each platform should be available

## 📦 Build Output Files

After building, you'll find installers in `clausen-desktop-app/dist/`:

### macOS
- `Clausen-2.0.0.dmg` - macOS installer (Intel)
- `Clausen-2.0.0-arm64.dmg` - macOS installer (Apple Silicon)
- `Clausen-2.0.0-mac.zip` - Portable app

### Windows
- `Clausen Setup 2.0.0.exe` - Windows installer (NSIS)
- `Clausen-2.0.0-win.zip` - Portable version

### Linux
- `Clausen-2.0.0.AppImage` - AppImage (universal)
- `clausen-desktop_2.0.0_amd64.deb` - Debian/Ubuntu package

## 🔄 How Automatic Updates Work

### For Existing Users (v1.1.0 → v2.0.0)

1. **User opens the app** (v1.1.0)
2. **App checks for updates** automatically on startup
3. **Dialog appears**: "A new version of Clausen is available!"
4. **User clicks "Download Update"**
5. **Progress shown** while downloading
6. **Dialog appears**: "Update downloaded. The app will restart to apply the update."
7. **User clicks "Restart Now"**
8. **App restarts** with v2.0.0 installed

### Technical Flow

```
App Startup
    ↓
Check GitHub Releases API
    ↓
Compare current version (1.1.0) vs latest (2.0.0)
    ↓
If newer version exists:
    ↓
Show "Update Available" dialog
    ↓
User clicks "Download Update"
    ↓
Download .exe/.dmg from GitHub Releases
    ↓
Verify signature
    ↓
Show "Update Ready" dialog
    ↓
User clicks "Restart Now"
    ↓
Quit app, install update, restart
    ↓
App now running v2.0.0
```

## 📝 Update Checker Code

The app checks for updates in `electron/main.js`:

```javascript
// Check for updates when main window is ready
setTimeout(() => {
  autoUpdater.checkForUpdates();
}, 5000); // 5 seconds after launch
```

Users can also manually check: **Help menu → Check for Updates**

## 🎨 Creating Release Notes

When the release is created, add these release notes on GitHub:

```markdown
# Clausen School Management System v2.0.0

## 🎉 Major New Features

### Fingerprint Biometric Support
- Enroll student fingerprints for quick identification
- Support for multiple USB fingerprint scanner brands
- Quality scoring and validation
- Secure encrypted storage

### Complete Database Integration
- Full MySQL/XAMPP support
- Student CRUD operations
- Connection pooling for performance
- Auto-generated student IDs

### Enhanced UI
- New fingerprint column in students table
- Beautiful scanning modal with animations
- Real-time connection status
- Improved search and filtering

## 🔧 Technical Improvements
- Upgraded to React 19.2.0
- Vite 7.2.2 build system
- Tailwind CSS 3.4.0
- Automatic update system
- Better error handling

## 📦 Installation

**Windows:** Download `Clausen Setup 2.0.0.exe`  
**macOS:** Download `Clausen-2.0.0.dmg`  
**Linux:** Download `Clausen-2.0.0.AppImage`

## 🆕 For New Users
1. Download installer for your platform
2. Install XAMPP and start MySQL
3. Create database using provided SQL script
4. Connect USB fingerprint scanner (optional)
5. Launch Clausen app

## 🔄 For Existing Users
Your app will automatically notify you about this update!
- Click "Download Update" when prompted
- Wait for download to complete
- Click "Restart Now" to apply update
- All your data will be preserved

## 📚 Documentation
- [Database Setup Guide](DATABASE_SETUP.md)
- [Fingerprint Setup Guide](FINGERPRINT_SETUP.md)
- [Student Management Guide](STUDENT_MANAGEMENT_GUIDE.md)

## 🐛 Bug Fixes
- Fixed loading window size issues
- Resolved navigation flow
- Fixed Tailwind CSS compatibility
- Improved Electron module loading

## 🙏 Requirements
- **OS:** Windows 10+, macOS 10.13+, Ubuntu 18.04+
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 200MB for app + space for database
- **Database:** MySQL 5.7+ (XAMPP included)
- **Optional:** USB fingerprint scanner for biometric features

---

**Full Changelog:** https://github.com/NiklausJoelBJunior/Clausen_technologies/compare/v1.1.0...v2.0.0
```

## 🔒 Code Signing (Optional but Recommended)

For production releases, consider code signing:

### macOS
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password
npm run build:mac
```

### Windows
```bash
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your_password
npm run build:win
```

## 📊 Distribution Channels

### 1. GitHub Releases (Automatic)
- Primary distribution method
- Automatic updates work from here
- Free hosting

### 2. Website Download (Optional)
Create download page with links to latest release:
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/latest/download/Clausen-Setup-2.0.0.exe
```

### 3. School Portal (Optional)
Host installers on school website for offline distribution

## 🧪 Testing Before Release

Before pushing to production:

1. **Test Installation**
   ```bash
   npm run build:mac
   # Install the .dmg and test
   ```

2. **Test Auto-Update**
   - Install v1.1.0
   - Release v2.0.0
   - Open v1.1.0 and verify update prompt

3. **Test Database**
   - Fresh install
   - Connect to MySQL
   - Add student
   - Enroll fingerprint

4. **Test on Clean System**
   - Virtual machine or clean computer
   - No development tools installed
   - Test full user experience

## 🚨 Troubleshooting Release Issues

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist dist-electron dist-vite
npm install
npm run build
```

### GitHub Token Issues
```bash
# Verify token has correct permissions
# Must have "repo" scope
# Check token not expired
```

### Upload Fails
- Check internet connection
- Verify GitHub repository settings
- Ensure release doesn't already exist
- Check GitHub token permissions

### Auto-Update Not Working
- Verify `publish` config in package.json
- Check GitHub release is marked as "Release" not "Pre-release"
- Ensure app ID matches in all versions
- Test with `autoUpdater.checkForUpdates()` manually

## 📞 Support

After release, monitor:
- GitHub Issues for bug reports
- Update download statistics
- User feedback on fingerprint scanner compatibility

## ✅ Post-Release Checklist

- [ ] Release created on GitHub
- [ ] All installers uploaded successfully
- [ ] Release notes published
- [ ] Documentation updated
- [ ] Announcement sent to users
- [ ] Download links tested
- [ ] Auto-update tested from v1.1.0
- [ ] Database migration tested
- [ ] Fingerprint scanner tested on different devices

---

## 🎊 You're Ready to Release!

Current version: **2.0.0**  
Major features: **Fingerprint Support + Database Integration**  
Auto-updates: **Enabled**  
Platform support: **Windows, macOS, Linux**

Run these commands to release:

```bash
# 1. Export GitHub token
export GH_TOKEN="your_token_here"

# 2. Commit and tag
git add .
git commit -m "Release v2.0.0"
git tag -a v2.0.0 -m "Version 2.0.0"
git push origin main --tags

# 3. Build and publish (macOS example)
cd clausen-desktop-app
npm run build:mac
```

The release will be live at:
**https://github.com/NiklausJoelBJunior/Clausen_technologies/releases**

Existing users will receive automatic update notifications! 🚀
