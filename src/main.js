const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
let Engine = require('./main/engine.js');
const engine = new Engine('test');
const Store = require('electron-store');
require('./main/menu.js');
import 'regenerator-runtime/runtime'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

async function handleAddNode(node) {
  engine.updateNode(node);
};

async function handleUpdateNode(node){
  engine.updateNode(node);
};

async function handleInitializeNodes(nodes){
  engine.initialzeNodes(nodes);
}

let mainWindow = null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // midi.init(mainWindow);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.whenReady().then(() => {
  // createWindow();
  // ipcMain.on('rete:handleNodeUpdate', handleNodeUpdate);
  ipcMain.on('rete:initializeNodes', (event, nodes) => {
    handleInitializeNodes(nodes);
  })

  ipcMain.on('rete:handleUpdateNode', (event, node) => {
    handleUpdateNode(node);
  })

  ipcMain.on('rete:handleAddNode', (event, node) => {
    handleAddNode(node);
  })

});

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
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.on('save-file', (event, value) => {
  dialog.showSaveDialog({
    title: 'Select the File Path to save',
    defaultPath: path.join(__dirname, '../assets/sample.txt'),
    // defaultPath: path.join(__dirname, '../assets/'),
    buttonLabel: 'Save',
    // Restricting the user to only Text Files.
    filters: [
      {
        name: 'Text Files',
        extensions: ['txt', 'docx']
      },],
    properties: []
  }).then(file => {
    // Stating whether dialog operation was cancelled or not.
    console.log(file.canceled);
    if (!file.canceled) {
      console.log(file.filePath.toString());

      // Creating and Writing to the sample.txt file
      fs.writeFile(file.filePath.toString(),
        'This is a Sample File', function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
    }
  }).catch(err => {
    console.log(err)
  });
});


const getFileFromUser = exports.getFileFromUser = () => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  }).then(result => {
    if (result.filePaths.length > 0) { openFile(result.filePaths[0]); }
  }).catch(err => {
    console.log(err);
  })
};

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
}