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
import { useRete } from "./rete/rete.jsx";
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

window.electronAPI.handleSaveFile((event, value) => {
  console.log('save file', value);
});

window.electronAPI.handleLoadFile((event, file, content) => {
  console.log('load file', file, content);
});

window.electronAPI.handleNewSession((event, value) => {
  console.log('new session');
});

window.electronAPI.handleRestoreSession((event, session) => {
  rendererEmitter.emit('restoreSession', session);
});

let renderEditor;
function ReteEditor(props) {
  const [setEditor] = props.setEditor;
  const editorRef = useRef(null);
  const [editorRefCurrent, setEditorRefCurrent] = useState(editorRef.current);
  const [setContainer] = useRete(rendererEmitter, [setEditorRefCurrent]);

  useEffect(() => {
    if (editorRefCurrent !== null){
      console.log('setting editor');
      setEditor(editorRef.current);
    }
  }, [editorRefCurrent])

  return (
    <div
      ref={(ref) => ref && setContainer(ref)}
    />
  );
}



function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [editor, setEditor] = useState(null);
  console.log('editor 0 ', editor);

  useEffect(() => {
      console.log('editor', editor);
      rendererEmitter.on('nodeselect', (node) => {
        setSelectedNode(node);
        console.log('selected node', node);
      });

      rendererEmitter.on('noderemoved', (node) => {
        setSelectedNode(null);
      });

      window.electronAPI.handleMidiMessage((event, value) => {
        console.log('midi event', event);
        console.log('midi value', value);
      })
  }, [editor]);

  return (
    <div className="app">
      {/* <button onClick={() => setVisible(false)}>Destroy</button> */}
      <div className="panel">
        {selectedNode && <Panel key={selectedNode.id} node={ selectedNode } emitter={rendererEmitter}/>}
      </div>
      <div className="rete">
        <ReteEditor setEditor={[setEditor]} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
