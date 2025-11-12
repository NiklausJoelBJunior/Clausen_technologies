const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  userLoggedIn: (userRole) => ipcRenderer.send('user-logged-in', userRole),
  onUserLoggedIn: (callback) => ipcRenderer.on('user-logged-in', (event, userRole) => callback(userRole)),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getCurrentVersion: () => ipcRenderer.invoke('get-current-version'),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progress) => callback(progress))
});
