# Auto-Update Setup Guide

## Quick Setup for GitHub Auto-Updates

### 1. First Time Setup

Your app is already configured to use GitHub releases for auto-updates!

**GitHub Repository**: `NiklausJoelBJunior/Clausen_technologies`

### 2. Building for Production

```bash
# Build for all platforms
npm run build

# Or build for specific platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

### 3. Publishing an Update

**Step-by-step process:**

1. **Update version** in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Go to GitHub and create a release**:
   - Visit: https://github.com/NiklausJoelBJunior/Clausen_technologies/releases/new
   - **Tag version**: `v1.0.1` (MUST start with 'v' and match package.json)
   - **Release title**: `Clausen v1.0.1`
   - **Description**: List your changes

4. **Upload these files from `dist/` folder**:

   **For Windows:**
   - `Clausen Setup 1.0.1.exe`
   - `latest.yml`

   **For macOS:**
   - `Clausen-1.0.1.dmg`
   - `latest-mac.yml`

   **For Linux:**
   - `Clausen-1.0.1.AppImage`
   - `latest-linux.yml`

5. **Click "Publish release"**

### 4. How Users Get Updates

**Automatic:**
- App checks for updates 15 seconds after launch
- Users see a notification when update is available
- They can choose to download and install immediately or later

**Manual:**
- Users can go to Settings
- Click "Check for Updates" button
- If update is available, they'll be prompted to download

### 5. Update Flow

```
User opens app
    ↓
15 seconds later
    ↓
App checks GitHub releases
    ↓
New version found?
    ↓ Yes
Show dialog: "Update Available"
    ↓
User clicks "Download Update"
    ↓
Download progress shown
    ↓
"Update Ready - Restart to install"
    ↓
User clicks "Restart Now"
    ↓
App installs update and restarts
```

### 6. Important Notes

⚠️ **ALWAYS upload the `.yml` files** - These are critical for auto-update to work!

⚠️ **Version format**: Use semantic versioning (1.0.0, 1.0.1, 1.1.0, etc.)

⚠️ **GitHub tag**: Must be `v` + version number (e.g., `v1.0.1`)

✅ **First release**: Tag it as `v1.0.0` to establish a baseline

### 7. Testing

During development, auto-update is disabled to prevent conflicts.

To test auto-update:
1. Build a production version
2. Install it on a computer
3. Publish a new version to GitHub (v1.0.1)
4. Open the installed app
5. It should detect and offer the update

### 8. Troubleshooting

**Updates not detected?**
- Check that `.yml` files were uploaded to the release
- Verify the version tag starts with 'v'
- Ensure package.json version matches the release tag (without 'v')
- Check the repository name is correct in package.json

**Download fails?**
- Ensure the installer files were uploaded to the release
- Check GitHub release is published (not draft)
- Verify file names match the pattern expected by electron-updater
