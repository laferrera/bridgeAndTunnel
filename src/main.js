const { app, BrowserWindow, dialog, ipcMain, Menu, session } = require("electron");
const fs = require("fs");
const Store = require("electron-store");
import menuTemplate from "./main/menu.js";
require("update-electron-app")({
  repo: "laferrera/bridgeAndTunnel",
  updateInterval: "1 hour",
});
import "regenerator-runtime/runtime";
import Engine from "./main/engine.js";
// import { generalSettings } from "./generalSettings.js";
const engine = new Engine("bridgeAndtunnel@0.1.0");
const store = new Store();
const windowStateKeeper = require("electron-window-state");
let mainWindow;
const usbDetect = require("usb-detection");

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.createWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    backgroundColor: "#CC016B",
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
  engine.setMainWindow(mainWindow);
  // TODO, seems like we shouldn't have to set engine/mainwindow both ways...
  // but how does the Menu functions access then?
  mainWindow.engine = engine;
  mainWindow.store = store;
};

app.on("ready", app.createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    app.createWindow();
  }
});

app.on("open-file", (event, file) => {
  event.preventDefault();
  const content = fs.readFileSync(file).toString();
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().send("load-file", file, content);
  } else {
    //TODO, hows the timing on this...
    app.createWindow();
    BrowserWindow.getFocusedWindow().send("load-file", file, content);
  }
});

app.on("undo", () => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().send("undo");
  }
});

app.on("redo", () => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().send("redo");
  }
});

app.on("selectAll", () => {
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().send("selectAll");
  }
});



app.on("will-quit", (event) => {
  console.log("we haven't quitted just yet...");
  if (BrowserWindow.getFocusedWindow()) {
    BrowserWindow.getFocusedWindow().send("redo");
  }
  usbDetect.stopMonitoring();
  if (engine.crow) {
    engine.crow.disconnect();
  }
  // TODO, kill ableton link somehow
  // delete engine.link;
});

const checkUSB = () => {
  usbDetect.startMonitoring();
  usbDetect.on("add", function (device) {
    console.log("add", device);
    // BrowserWindow.getFocusedWindow().send("device-added");
    // send to engine and let engine talk to renderer
  });
  usbDetect.on("remove", function (device) {
    console.log("remove", device);
    // BrowserWindow.getFocusedWindow().send("device-removed");
    // send to engine and let engine talk to renderer
  });
};

async function getRendererInitialData() {
  //TODO, this is a bit of a mess, should be a class
  // move some of this to the engine?
  let data = { session: store.get("session") };
  data.config = {};
  data.config.midiInputs = engine.getMIDIInputPorts();
  data.config.midiOutputs = engine.getMIDIOutputPorts();
  // try and connect crow?
  engine.setupCrow();
  return data;
}

async function getMIDIPorts() {
  return engine.getMIDIPorts();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.whenReady().then(() => {
  app.menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(app.menu);

  // TODO, the editor should request instead of the main process sending
  // the editor isn't setup in time

  mainWindow.engine.updateMIDIPorts();

  ipcMain.handle("get-initial-data", getRendererInitialData);
  ipcMain.handle("get-midi-devices", getMIDIPorts);

  ipcMain.on("rete:sendNodesToMain", (event, nodes) => {
    // this used to be an async function, does it need to be
    engine.storeNodes(nodes);
  });

  ipcMain.on("send-lines-to-crow", (event, cmd) => {
    engine.sendLinesToCrow(cmd);
  });

  ipcMain.on("rete:engine-process-json", (event, json) => {
    console.log("cur file path", app.filePath);
    engine.processJSON(json);
  });

  ipcMain.on("store-session", (event, session) => {
    store.set("session", session);
  });

  checkUSB();
});
