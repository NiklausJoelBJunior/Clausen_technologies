# 🚀 Quick Release Reference

## Prerequisites Checklist
- [ ] GitHub Personal Access Token created (with `repo` scope)
- [ ] All changes committed to git
- [ ] Database setup tested
- [ ] Fingerprint scanner tested
- [ ] App tested on clean system

## Quick Commands

### 1️⃣ Set GitHub Token
```bash
# macOS/Linux
export GH_TOKEN="ghp_your_token_here"

# Windows PowerShell
$env:GH_TOKEN="ghp_your_token_here"

# Windows CMD
set GH_TOKEN=ghp_your_token_here
```

### 2️⃣ Automated Release (Recommended)
```bash
cd clausen-desktop-app

# macOS/Linux
./release.sh

# Windows
release.bat
```

### 3️⃣ Manual Release

**Commit Changes:**
```bash
git add .
git commit -m "Release v2.0.0 - Fingerprint support"
```

**Create Tag:**
```bash
git tag -a v2.0.0 -m "Version 2.0.0"
```

**Push to GitHub:**
```bash
git push origin main
git push origin v2.0.0
```

**Build & Publish:**
```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux

# All platforms (macOS only)
npm run build:all
```

## File Locations After Build

```
clausen-desktop-app/dist/
├── Clausen Setup 2.0.0.exe         # Windows Installer
├── Clausen-2.0.0.dmg               # macOS Installer (Intel)
├── Clausen-2.0.0-arm64.dmg         # macOS Installer (Apple Silicon)
├── Clausen-2.0.0.AppImage          # Linux Universal
└── clausen-desktop_2.0.0_amd64.deb # Ubuntu/Debian Package
```

## GitHub Release URL
```
https://github.com/NiklausJoelBJunior/Clausen_technologies/releases
```

## Auto-Update Flow
```
User opens v1.1.0
    ↓
App checks GitHub API
    ↓
Finds v2.0.0 available
    ↓
Shows "Update Available" dialog
    ↓
User clicks "Download Update"
    ↓
Downloads installer from GitHub
    ↓
Shows "Update Ready" dialog
    ↓
User clicks "Restart Now"
    ↓
App updates to v2.0.0 automatically
```

## Troubleshooting Quick Fixes

**Build Fails:**
```bash
rm -rf node_modules dist dist-electron dist-vite
npm install
npm run build
```

**Token Issues:**
```bash
# Test token
curl -H "Authorization: token $GH_TOKEN" https://api.github.com/user
```

**Tag Already Exists:**
```bash
git tag -d v2.0.0
git push origin :refs/tags/v2.0.0
git tag -a v2.0.0 -m "Version 2.0.0"
git push origin v2.0.0
```

## Version History
- **v2.0.0** - Current (Fingerprint + Database)
- **v1.1.0** - React Migration
- **v1.0.0** - Initial Release

## Support Links
- **Documentation:** `/clausen-desktop-app/*.md`
- **Issues:** https://github.com/NiklausJoelBJunior/Clausen_technologies/issues
- **Releases:** https://github.com/NiklausJoelBJunior/Clausen_technologies/releases

## One-Line Release (For Experts)
```bash
export GH_TOKEN="your_token" && git add . && git commit -m "Release v2.0.0" && git tag -a v2.0.0 -m "v2.0.0" && git push origin main --tags && cd clausen-desktop-app && npm run release
```

---
**Current Version:** 2.0.0  
**Release Date:** December 1, 2025  
**Major Features:** Fingerprint Scanning + MySQL Database + Auto-Updates
