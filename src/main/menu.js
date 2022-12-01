// const mainProcess = require('../main');
const path = require('path');
const fs = require('fs');
const { app, dialog, BrowserWindow } = require('electron')
const isMac = process.platform === 'darwin'
const mainWindow = BrowserWindow.fromId(1);

const getFileFromUser = () => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['json'] }
    ]
  }).then(result => {
    if (result.filePaths.length > 0) { 
      openFile(result.filePaths[0]); 
      app.addRecentDocument(result.filePaths[0]);
    }
  }).catch(err => {
    console.log(err);
  })
};

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  BrowserWindow.fromId(1).webContents.send('load-file', file, content);
}

const saveFile = () => {
  dialog.showSaveDialog({
    title: 'Select the File Path to save',
    defaultPath: path.join(__dirname, '../assets/sample'),
    buttonLabel: 'Save',
    // Restricting the user to only Text Files.
    filters: [
      {
        name: 'Text Files', extensions: ['json']
      },],
    properties: []
  }).then(file => {
    // Stating whether dialog operation was cancelled or not.
    console.log(file.canceled);
    if (!file.canceled) {
      console.log(file.filePath.toString());
      // Creating and Writing to the sample.txt file
      fs.writeFile(file.filePath.toString(),
        JSON.stringify(BrowserWindow.fromId(1).engine.nodes), function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
      app.addRecentDocument(file.filePath);
    }
  }).catch(err => {
    console.log(err)
  });
}

const newSession = () => {
  if (BrowserWindow.getAllWindows().length !== 0) {
    dialog.showMessageBox(mainWindow, {
      message: "Are you sure? All unsaved changes will be lost.",
      type: "warning",
      buttons: ["Cancel", "New"],
      defaultId: 0,
      title: "New Session",
      cancelId: 0,
    }).then(result => {
      if (result.response === 1) { 
        BrowserWindow.fromId(1).webContents.send('new-session');
      }
    }).catch(err => {
      console.log(err);
    })
  } else {
    app.createWindow();
  }
}

const menuTemplate = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' },
      { label: 'New',
        accelerator: 'CommandOrControl+N',
        click: async () => {
          newSession();
        }
      },
      { label: 'Save As',
        accelerator: 'CommandOrControl+S',
        click: async () => {
          saveFile();
        },
      },
      {
        label: 'Open File',
        accelerator: 'CommandOrControl+O',
        click: async () => {
          getFileFromUser();
        },
      },
      // { role: 'save' },

      {
        label: "Open Recent",
        role: "recentdocuments",
        submenu: [
          {
            label: "Clear Recent",
            role: "clearrecentdocuments"
          }
        ]
      }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      //todo, take this out at production
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Visit Website',
        click() { /* To be implemented */ }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'CommandOrControl+U',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      }
    ]
  }
]


// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)
// export default menu;
export default menuTemplate;