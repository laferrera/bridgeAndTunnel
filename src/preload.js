// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // to Main process from Renderer
    updateNode: (node) => ipcRenderer.send('rete:handleUpdateNode', node),
    addNode: (node) => ipcRenderer.send('rete:handleAddNode', node),
    sendNodesToMain: (json) => ipcRenderer.send('rete:sendNodesToMain', json),
    engineProcessJSON: (json) => ipcRenderer.send('rete:engineProcessJSON', json),
    storeSession: (json) => ipcRenderer.send('store-session', json),
    getInitialData: () => ipcRenderer.invoke('get-initial-data'),

    // to Renderer from Main process
    handleRestoreSession: (callback) => ipcRenderer.on('restore-session',callback),
    handleEngineError: (callback) => ipcRenderer.on('engine-error', callback),
    handleNodeEvent: (callback) => ipcRenderer.on('node-event', callback),
    handleMidiMessage: (callback) => ipcRenderer.on('midi-message', callback),
    handleSaveFile: (callback) => ipcRenderer.on('save-file', callback),
    handleLoadFile: (callback) => ipcRenderer.on('load-file', callback),
    handleNewSession: (callback) => ipcRenderer.on('new-session', callback),
    handleRestoreSession: (callback) => ipcRenderer.on('restore-session', callback),
    handleMidiDeviceUpdate: (callback) => ipcRenderer.on('midi-device-update', callback),
})