const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;
let loadingWindow;

// Auto-updater configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Auto-updater event listeners
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version of Clausen is available!',
    buttons: ['Download Update', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', () => {
  console.log('App is up to date');
});

autoUpdater.on('error', (err) => {
  console.error('Error in auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`;
  console.log(log_message);
  if (mainWindow) {
    mainWindow.webContents.send('download-progress', progressObj);
  }
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. The application will restart to install the update.',
    buttons: ['Restart Now', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall(false, true);
    }
  });
});

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  loadingWindow.loadFile('renderer/loading.html');
  loadingWindow.center();

  // After 12 seconds, close loading window and show main window
  setTimeout(() => {
    createMainWindow();
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
  }, 12000);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    icon: path.join(__dirname, 'assets/LOGO WITH NO BACKGROUND.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0a0a0a',
    title: 'Clausen - School Management System',
    show: false
  });

  // Load the login page
  mainWindow.loadFile('renderer/login.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createLoadingWindow();
  
  // Check for updates after 15 seconds (after loading screen)
  setTimeout(() => {
    if (!process.env.IS_DEV) {
      autoUpdater.checkForUpdates();
    }
  }, 15000);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoadingWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for communication between renderer and main process
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

// Window control handlers
ipcMain.on('minimize-window', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) mainWindow.close();
});

// Login handler
ipcMain.handle('login', (event, credentials) => {
  // In a real app, validate credentials against a database
  const { role, username, password } = credentials;
  
  // Demo credentials (replace with real authentication)
  const validCredentials = {
    'Administrator': { username: 'admin', password: 'admin123' },
    'Bursar': { username: 'bursar', password: 'bursar123' },
    'Nurse': { username: 'nurse', password: 'nurse123' },
    'DOS': { username: 'dos', password: 'dos123' },
    'Teacher': { username: 'teacher', password: 'teacher123' }
  };

  if (validCredentials[role] && 
      validCredentials[role].username === username && 
      validCredentials[role].password === password) {
    return { success: true, role };
  }
  
  return { success: false, message: 'Invalid credentials' };
});

// Load main app after successful login
ipcMain.on('load-main-app', (event, userRole) => {
  if (mainWindow) {
    mainWindow.loadFile('renderer/index.html');
    // Store user role for the session
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('user-logged-in', userRole);
    });
  }
});

// Manual update check
ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, updateInfo: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get current app version
ipcMain.handle('get-current-version', () => {
  return app.getVersion();
});
