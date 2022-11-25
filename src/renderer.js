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

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './app.jsx';
// import 'regenerator-runtime/runtime'
// import './renderer/rete/rete.js'

// // // import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();


import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import 'regenerator-runtime/runtime'
import { useRete } from "./renderer/rete/rete.jsx";
// import { Panel } from "./renderer/panel/panel.jsx";
import PanelExp from "./renderer/panel/panelExperiment.jsx";
import './index.css';

const EventEmitter = require("events");
const globalEmitter = new EventEmitter();

function ReteEditor() {
  const [setContainer] = useRete(globalEmitter);
  return (
    <div
      ref={(ref) => ref && setContainer(ref)}
    />
  );
}

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [reteVisible, setReteVisible] = useState(true);

  useEffect(() => {
    globalEmitter.on('nodeselect', (node) => {
      console.log('render nodeselect', node.id);
      setSelectedNode(node);
    });
    globalEmitter.on('noderemoved', (node) => {
      setSelectedNode(null);
    });
  }, []);


  return (
    <div className="app">
      {/* <button onClick={() => setVisible(false)}>Destroy</button> */}
      <div className="panel">
        {selectedNode !== null&& <PanelExp key= {selectedNode.id} node={ selectedNode }/>}
      </div>
      <div className="rete">
        {reteVisible && <ReteEditor />}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
