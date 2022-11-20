// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    nodeUpdate: (json) => ipcRenderer.send('rete:handleNodeUpdate', json),
    onMidiMessage: (callback) => ipcRenderer.on('midi-message', callback)

})