const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('API',{
  getInterfaces: () => ipcRenderer.invoke('os:getInterfaces'),
  readStringFile: (path) => ipcRenderer.invoke('os:readStringFile', path),
  readPcapFile: (path) => ipcRenderer.invoke('os:readFile', path),
  readPcapBytes: (xts) => ipcRenderer.invoke('os:readPcapBytes', xts),

  getNewInstance: (data) => ipcRenderer.invoke('net:getNewInstance', data),
  getInstacePackets: (data) => ipcRenderer.invoke('net:getInstacePackets', data),
  closeInstance: (data) => ipcRenderer.invoke('net:closeInstance', data)
})