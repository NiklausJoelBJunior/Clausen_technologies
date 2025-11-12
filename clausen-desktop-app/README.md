# Clausen Desktop Application

Desktop application for the Clausen School Management System built with Electron.

## Features

- Cross-platform (Windows, macOS, Linux)
- Frameless modern UI with custom title bar
- 12-second animated loading screen
- Role-based login system (Administrator, Bursar, Nurse, DOS, Teacher)
- Student Management
- Teacher Management
- Class Management
- Attendance Tracking
- Grades Management
- Reports & Analytics
- Modern UI with dark theme and teal accents

## Demo Login Credentials

For testing purposes, use these credentials:

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Bursar | bursar | bursar123 |
| Nurse | nurse | nurse123 |
| DOS | dos | dos123 |
| Teacher | teacher | teacher123 |

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start in development mode
npm start
```

### Building for Production

```bash
# Build for all platforms
npm run build

# Build for Windows only
npm run build:win

# Build for macOS only
npm run build:mac

# Build for Linux only
npm run build:linux
```

The built applications will be available in the `dist` folder.

## Auto-Update System

The application includes an automatic update system that checks for new versions on GitHub.

### How It Works

1. **Automatic Checking**: The app checks for updates 15 seconds after launch
2. **User Notification**: Users are notified when an update is available
3. **Download & Install**: Users can choose to download and install updates
4. **Manual Check**: Users can manually check for updates from Settings

### Publishing Updates to GitHub

1. **Update version in package.json**:
   ```json
   "version": "1.0.1"
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Create a GitHub Release**:
   - Go to your repository: https://github.com/NiklausJoelBJunior/Clausen_technologies
   - Click "Releases" → "Create a new release"
   - Tag version: `v1.0.1` (must match package.json version with 'v' prefix)
   - Upload the built files from `dist/` folder:
     - For Windows: `Clausen Setup 1.0.1.exe` and `latest.yml`
     - For macOS: `Clausen-1.0.1.dmg` and `latest-mac.yml`
     - For Linux: `Clausen-1.0.1.AppImage` and `latest-linux.yml`
   - Publish the release

4. **Automatic Updates**: All installed apps will automatically detect and offer to install the new version!

### Important Files

- `latest.yml` / `latest-mac.yml` / `latest-linux.yml`: Update metadata files that MUST be uploaded with each release
- These files tell the app what version is available and where to download it

### Testing Updates

During development, auto-update is disabled. To test:
1. Build a production version
2. Install it on a test machine
3. Publish a new version to GitHub
4. The installed app should detect the update

## Project Structure

```
clausen-desktop-app/
├── assets/              # Application icons and images
├── renderer/            # Frontend files
│   ├── index.html      # Main HTML
│   ├── styles.css      # Styles
│   └── app.js          # Frontend JavaScript
├── main.js             # Electron main process
├── preload.js          # Preload script for security
└── package.json        # Dependencies and build config
```

## Technology Stack

- **Electron**: Desktop application framework
- **HTML/CSS/JavaScript**: Frontend
- **electron-builder**: Building and packaging

## License

ISC
