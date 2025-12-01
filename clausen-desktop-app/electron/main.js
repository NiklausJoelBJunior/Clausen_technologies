const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { initDatabase, studentOperations, closeDatabase } = require('./database');
const fingerprintScanner = require('./fingerprint');

let mainWindow;
let loadingWindow;
let isDatabaseConnected = false;

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
    message: 'Update downloaded. The app will restart to apply the update.',
    buttons: ['Restart Now', 'Later'],
    defaultId: 0
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 450,
    height: 650,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // For Vite dev mode
  if (process.env.VITE_DEV_SERVER_URL) {
    loadingWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/loading`);
  } else {
    loadingWindow.loadFile(path.join(__dirname, '../dist-vite/index.html'), { hash: '/loading' });
  }

  // Show loading screen for 12 seconds then show login
  setTimeout(() => {
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
      createLoginWindow();
    }
  }, 12000);
}

function createLoginWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // For Vite dev mode
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/login`);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist-vite/index.html'), { hash: '/login' });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // For Vite dev mode
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist-vite/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Check for updates only in production
    if (!process.env.VITE_DEV_SERVER_URL && app.isPackaged) {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
      }, 3000);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-current-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.on('user-logged-in', (event, userRole) => {
  if (mainWindow) {
    mainWindow.webContents.send('user-logged-in', userRole);
  }
});

// Window controls
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
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
  if (mainWindow) {
    mainWindow.close();
  }
});

// Database IPC handlers
ipcMain.handle('db-add-student', async (event, studentData) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.addStudent(studentData);
});

ipcMain.handle('db-get-students', async (event, filters) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.getAllStudents(filters);
});

ipcMain.handle('db-get-student', async (event, studentId) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.getStudentById(studentId);
});

ipcMain.handle('db-update-student', async (event, studentId, studentData) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.updateStudent(studentId, studentData);
});

ipcMain.handle('db-delete-student', async (event, studentId) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.deleteStudent(studentId);
});

ipcMain.handle('db-get-stats', async () => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.getStudentStats();
});

ipcMain.handle('db-update-fingerprint', async (event, studentId, fingerprintData) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.updateFingerprint(studentId, fingerprintData);
});

ipcMain.handle('db-get-student-by-fingerprint', async (event, fingerprintData) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.getStudentByFingerprint(fingerprintData);
});

ipcMain.handle('db-remove-fingerprint', async (event, studentId) => {
  if (!isDatabaseConnected) {
    return { success: false, message: 'Database not connected' };
  }
  return await studentOperations.removeFingerprint(studentId);
});

ipcMain.handle('db-status', async () => {
  return { connected: isDatabaseConnected };
});

// App lifecycle
app.whenReady().then(async () => {
  // Initialize database connection
  isDatabaseConnected = await initDatabase();
  if (!isDatabaseConnected) {
    dialog.showErrorBox(
      'Database Connection Failed',
      'Could not connect to MySQL database. Make sure XAMPP MySQL is running and database "clausen_school" exists.\n\nThe app will continue but database features will not work.'
    );
  }
  
  createLoadingWindow();
});

app.on('window-all-closed', () => {
  closeDatabase();
  fingerprintScanner.disconnect();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createLoadingWindow();
  }
});

// ===== Fingerprint Scanner IPC Handlers =====

// List available fingerprint scanners
ipcMain.handle('list-fingerprint-devices', async () => {
  try {
    const devices = await fingerprintScanner.listDevices();
    return { success: true, devices };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Connect to fingerprint scanner
ipcMain.handle('connect-fingerprint-scanner', async (event, devicePath) => {
  try {
    await fingerprintScanner.connect(devicePath);
    return { success: true, message: 'Scanner connected successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Disconnect fingerprint scanner
ipcMain.handle('disconnect-fingerprint-scanner', async () => {
  try {
    fingerprintScanner.disconnect();
    return { success: true, message: 'Scanner disconnected' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Scan fingerprint
ipcMain.handle('scan-fingerprint', async () => {
  try {
    const result = await fingerprintScanner.scan();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Verify fingerprint
ipcMain.handle('verify-fingerprint', async (event, { scannedTemplate, storedTemplate }) => {
  try {
    const result = await fingerprintScanner.verify(scannedTemplate, storedTemplate);
    return { success: true, ...result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get scanner status
ipcMain.handle('get-scanner-status', async () => {
  try {
    const status = fingerprintScanner.getStatus();
    return { success: true, ...status };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
