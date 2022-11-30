// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // to Main process from Renderer
    updateNode: (node) => ipcRenderer.send('rete:handleUpdateNode', node),
    addNode: (node) => ipcRenderer.send('rete:handleAddNode', node),
    initializeNodes: (json) => ipcRenderer.send('rete:initializeNodes', json),
    engineProcessJSON: (json) => ipcRenderer.send('rete:engineProcessJSON', json),
    // to Renderer from Main process
    handleEngineError: (callback) => ipcRenderer.on('engine-error', callback),
    handleNodeEvent: (callback) => ipcRenderer.on('node-event', callback),
    handleMidiMessage: (callback) => ipcRenderer.on('midi-message', callback),
    handleSaveFile: (callback) => ipcRenderer.on('save-file', callback),
    handleLoadFile: (callback) => ipcRenderer.on('load-file', callback),
    handleNewSession: (callback) => ipcRenderer.on('new-session', callback),
})