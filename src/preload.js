// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    updateNode: (node) => ipcRenderer.send('rete:handleUpdateNode', node),
    addNode: (node) => ipcRenderer.send('rete:handleAddNode', node),
    initializeNodes: (json) => ipcRenderer.send('rete:initializeNodes', json),
    onMidiMessage: (callback) => ipcRenderer.on('midi-message', callback)
})