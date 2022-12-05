const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const Store = require('electron-store');
import menuTemplate from './main/menu.js';
require('update-electron-app')({
  repo: 'laferrera/bridgeAndTunnel',
  updateInterval: '1 hour'
})
import 'regenerator-runtime/runtime'
import Engine from './main/engine.js';
import {generalSettings} from './generalSettings.js';
const engine = new Engine('bridgeAndtunnel@0.1.0');
const store = new Store();
let mainWindow;

// const usbDetect = require('usb-detection');

if (require('electron-squirrel-startup')) {
  app.quit();
}


app.createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // TODO, background
    backgroundColor: '#ff00ff',
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
  engine.setMainWindow(mainWindow);
  // TODO, seems like we shouldn't have to set engine/mainwindow both ways...
  mainWindow.engine = engine;
};


app.on('ready', app.createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    app.createWindow();
  }
});



const checkUSB = () => {
  usbDetect.startMonitoring();
  usbDetect.on('add', function (device) { console.log('add', device); });
  usbDetect.on('remove', function (device) { console.log('remove', device); });
// Allow the process to exit
//usbDetect.stopMonitoring()
}


async function getRendererInitialData() {
  let data = { session: store.get('session')}; 
  data.config = {};
  data.config.midiInputs = engine.getMIDIInputPorts();
  return data;
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.whenReady().then(() => {

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // TODO, the editor should request instead of the main process sending
  // the editor isn't setup in time
  
  mainWindow.engine.updateMIDIPorts();
  
  ipcMain.handle('get-initial-data', getRendererInitialData)

  

  ipcMain.on('rete:sendNodesToMain', (event, nodes) => {
    // this used to be an async function, does it need to be
    engine.storeNodes(nodes);
  });

  ipcMain.on('rete:engineProcessJSON', (event, json) => {
    engine.processJSON(json);
  })

  ipcMain.on('store-session', (event, session) => {
    store.set('session', session);
  });

  mainWindow.webContents.session.on('serial-port-added', (event, port) => {
    console.log('serial-port-added FIRED WITH', port)
    //Optionally update portList to add the new port
  })

  mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
    console.log('serial-port-removed FIRED WITH', port)
    //Optionally update portList to remove the port
  })

});

