const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('electronAPI',{
  getInterfaces: () => ipcRenderer.invoke('os:getInterfaces')
})