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
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, progress) => callback(progress)),
  
  // Database operations
  database: {
    addStudent: (studentData) => ipcRenderer.invoke('db-add-student', studentData),
    getStudents: (filters) => ipcRenderer.invoke('db-get-students', filters),
    getStudent: (studentId) => ipcRenderer.invoke('db-get-student', studentId),
    updateStudent: (studentId, studentData) => ipcRenderer.invoke('db-update-student', studentId, studentData),
    deleteStudent: (studentId) => ipcRenderer.invoke('db-delete-student', studentId),
    getStats: () => ipcRenderer.invoke('db-get-stats'),
    checkConnection: () => ipcRenderer.invoke('db-status'),
    updateFingerprint: (studentId, fingerprintData) => ipcRenderer.invoke('db-update-fingerprint', studentId, fingerprintData),
    getStudentByFingerprint: (fingerprintData) => ipcRenderer.invoke('db-get-student-by-fingerprint', fingerprintData),
    removeFingerprint: (studentId) => ipcRenderer.invoke('db-remove-fingerprint', studentId)
  },
  
  // Fingerprint scanner operations
  fingerprint: {
    listDevices: () => ipcRenderer.invoke('list-fingerprint-devices'),
    connect: (devicePath) => ipcRenderer.invoke('connect-fingerprint-scanner', devicePath),
    disconnect: () => ipcRenderer.invoke('disconnect-fingerprint-scanner'),
    scan: () => ipcRenderer.invoke('scan-fingerprint'),
    verify: (data) => ipcRenderer.invoke('verify-fingerprint', data),
    getStatus: () => ipcRenderer.invoke('get-scanner-status')
  }
});
