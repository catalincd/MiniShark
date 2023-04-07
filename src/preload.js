const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('API',{
  getInterfaces: () => ipcRenderer.invoke('os:getInterfaces'),
  readStringFile: (path) => ipcRenderer.invoke('os:readStringFile', path),
  readPcapFile: (path) => ipcRenderer.invoke('os:readFile', path),
  readPcapBytes: (path) => ipcRenderer.invoke('os:readPcapBytes', path)
})