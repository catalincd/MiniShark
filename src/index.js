const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { fstat } = require('node:fs');
const os = require('node:os');
const path = require('path');
const fs = require('fs');
const mshark = require('./lib/mshark')
const parser = require('./lib/parser')

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
      sandbox: false
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  //mainWindow.webContents.openDevTools();
};


const handleGetInterfaces = (event, data) => os.networkInterfaces()
const handleReadFile = (event, data) => parser.readFromFile(data)
const handleReadPcapBytes = (event, data) => parser.readFromBytes(Buffer.from(data))
const handleReadStringFile = (event, data) => {
  return fs.readFileSync(__dirname + data, 'utf8')
}
const handleNewInstance = (event, {ip, filter}) => mshark.getNewInstance(ip, filter)
const handleInstacePackets = (event, id) => mshark.getPackets(id)
const handleCloseInstance = (event, id) => mshark.closeInstance(id)



app.whenReady().then(() => {
  ipcMain.handle('os:getInterfaces', handleGetInterfaces)
  ipcMain.handle('os:readStringFile', handleReadStringFile)
  ipcMain.handle('os:readFile', handleReadFile)
  ipcMain.handle('os:readPcapBytes', handleReadPcapBytes)
  ipcMain.handle('net:getNewInstance', handleNewInstance)
  ipcMain.handle('net:getInstacePackets', handleInstacePackets)
  ipcMain.handle('net:closeInstance', handleCloseInstance)

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



//var coxid = mshark.getNewInstance()
