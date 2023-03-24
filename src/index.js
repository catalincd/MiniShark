const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const os = require('node:os');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  //mainWindow.webContents.openDevTools();
};


const handleGetInterfaces = () => os.networkInterfaces()


app.whenReady().then(() => {
  ipcMain.handle('os:getInterfaces', handleGetInterfaces)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

