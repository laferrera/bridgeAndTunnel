/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */


console.log('👋 This message is being logged by "renderer.js", included via webpack');

import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import 'regenerator-runtime/runtime'
import { useRete, createEditor } from "./rete/rete.jsx";
import addStarterNodes from "./rete/addStarterNodes.js";
import Panel from "./renderer/panel/panel.jsx";
import './index.css';

const EventEmitter = require("events");
const rendererEmitter = new EventEmitter();

window.electronAPI.handleEngineError((event, message, data) => {
  // TODO
  // https://stackoverflow.com/questions/4866986/detect-if-an-alert-or-confirm-is-displayed-on-a-page
  window.alert("Engine Error! " + message);
  console.log(data);
});

window.electronAPI.handleMidiMessage((event, value) => {
  console.log('midi message', value);
});

window.electronAPI.handleMidiDeviceUpdate((event, value) => {
  console.log('midi device update', value);
});

window.electronAPI.handleSaveFile((event, value) => {
  console.log('save file', value);
});

window.electronAPI.handleLoadFile((event, file, content) => {
  console.log('load file', file, content);
});

window.electronAPI.handleNewSession((event, value) => {
  console.log('new session');
});

let editorRef;
let editor;
let initialData;
const editorComponent = (<div ref={(ref) => ref && createEditor(ref, rendererEmitter, editorRef)} />);

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [pannelState, setPanelState] = useState(Date.now());
  editorRef = useRef(null);

  useEffect(() => {
    editor = editorRef.current;
    
    if(initialData.session){
      try {
        editor.fromJSON(initialData.session);
        editor.zoomToNodes();
      } catch (error) {
        console.error(error);
        addStarterNodes(editor);
      }
    } else {
      addStarterNodes(editor);
    }

    editor.on('nodeselected', (node) => {
      setPanelState(Date.now());
      setSelectedNode(node);
    });

    editor.on('undo redo', () => {
      if (editor.selected.list.length) {
        // TODO, rerender panel here... 
        setPanelState(Date.now());
        setSelectedNode(editor.selected.list[0]);
      }
    });

    window.electronAPI.handleMidiMessage((event, value) => {
      console.log('midi event', event);
      console.log('midi value', value);
    })
  }, []);

  return (
    <div className="app">
      <div className="panel">
        {selectedNode && <Panel key={pannelState} node={selectedNode} editor={editor} emitter={rendererEmitter}/>}
      </div>
      <div className="rete">
        {editorComponent}
      </div>
    </div>
  );
}


window.electronAPI.getInitialData().then(data => {
  initialData = data;
  console.log('initial data.sessions', initialData.session);
  const rootElement = document.getElementById("root");
  createRoot(rootElement).render(<App />);
})
