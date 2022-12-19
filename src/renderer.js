import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "regenerator-runtime/runtime";
import { useRete, createEditor } from "./rete/rete.jsx";
import addStarterNodes from "./rete/addStarterNodes.js";
import { uiConfigs } from "./renderer/nodeConfigs";
import Panel from "./renderer/panel/panel.jsx";
import "./renderer/css/index.css";
import "./renderer/css/contextMenu.css";

const EventEmitter = require("events");
const rendererEmitter = new EventEmitter();
let nodeIndexCounter = 1;


window.electronAPI.handleEngineError((event, message, data) => {
  // TODO
  // https://stackoverflow.com/questions/4866986/detect-if-an-alert-or-confirm-is-displayed-on-a-page
  window.alert("Engine Error! " + message);
  console.log(data);
});

window.electronAPI.handleMidiMessage((event, value) => {
  console.log("midi message", value);
});

window.electronAPI.handleMidiDeviceUpdate((event, value) => {
  config.midiInputs = value.midiInputs;
  config.midiOutputs = value.midiOutputs;
  buildConfig();
});

window.electronAPI.handleSaveFile((event, value) => {
  console.log("save file", value);
});

window.electronAPI.handleLoadFile((event, file, content) => {
  const data = JSON.parse(content);
  console.log("load file", file, data);
  editor.fromJSON(data.editor).then(() => {
    editor.setHistory(data.history);
    editor.zoomToNodes();
    renderWires();
  });
});

window.electronAPI.handleNewSession((event, value) => {
  editor.clear();
});

window.electronAPI.handleUndo((event, value) => {
  editor.trigger("undo");
});

window.electronAPI.handleRedo((event, value) => {
  editor.trigger("redo");
});

window.electronAPI.handleSelectAll((event, value) => {
  editor.nodes.forEach(function (node) {
    editor.selectNode(node, true);
  });
});


window.electronAPI.handleReceiveLinesFromCrow((event, data) => {
  let crowNodes = editor.nodes.filter((n) => n.name == "Crow");
  crowNodes.forEach((c) => {
    let type = "output";
    if (data.startsWith("repl")) {
      type = "error";
    }
    const outputLine = { type: type, value: data };
    c.data.config.repl.value.push(outputLine);
    rendererEmitter.emit("crowReplUpdate", outputLine);
  });
});

const buildConfig = () => {
  uiConfigs.midiReceiverConfig.portName.options = config.midiInputs;
  uiConfigs.midiEmitterConfig.portName.options = config.midiOutputs;
};

let editorRef;
let editor;
let initialData;
let config = {};
const editorComponent = (
  <div ref={(ref) => ref && createEditor(ref, rendererEmitter, editorRef)} />
);

const renderWires = () => {
      setTimeout(() => {
      editor.nodes.forEach((n) => {
        editor.view.updateConnections({ node: n });
      });
    }, 200);
};

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [pannelState, setPanelState] = useState(Date.now());
  const [panelRepl, setPanelRepl] = useState(null);
  editorRef = useRef(null);

  useEffect(() => {
    editor = editorRef.current;
    console.log("editor", editor);

    // build nodes
    if (initialData.session.editor) {
      try {
        editor.fromJSON(initialData.session.editor).then(() => {
          // TODO, history... 
          // console.log("initialData.session.history",  initialData.session.history);
          // editor.setHistory(initialData.session.history);
          editor.zoomToNodes();
        });
      } catch (error) {
        console.error(error);
        addStarterNodes(editor).then(() => {
          editor.zoomToNodes();
        });
      }
    } else {
      console.log("what happened to initial data?", initialData)
      addStarterNodes(editor).then(() => {
        editor.zoomToNodes();
      });
    }

    // something better for this...
    renderWires();

    // set up listeners
    editor.on("nodeselected", (node) => {
      setSelectedNode(node);
      setPanelState(Date.now());
      editor.trigger("hidecontextmenu");
      // editor.view.nodes.forEach((n) => { n.el.style.zIndex = 1; });
      nodeIndexCounter++;
      editor.view.nodes.get(node).el.style.zIndex = nodeIndexCounter;
      // TODO, set meta when loading from JSON or something
      node.setMeta({ zIndex: nodeIndexCounter });
      if (node.name.toLowerCase().includes("midi")) {
        window.electronAPI.getMidiDevices().then((data) => {
          config.midiInputs = data.midiInputs;
          config.midiOutputs = data.midiOutputs;
          buildConfig();
          setPanelState(Date.now());
        });
      }
    });

    rendererEmitter.on("crowReplUpdate", (outputLine) => {
      if (
        editor.selected.list.length &&
        editor.selected.list[0].name == "Crow"
      ) {
        // setPanelState(Date.now());
        setPanelRepl(outputLine);
      }
    });

    editor.on("undo redo", () => {
      if (editor.selected.list.length) {
        setPanelState(Date.now());
        setSelectedNode(editor.selected.list[0]);
      }
      //TODO why doesn't undo/redo update the engine?
      window.electronAPI.sendNodesToMain(editor.toJSON().nodes);
    });

    editor.on("nodedragged", (node) => {
      editor.containNodesToEditorView(node);
      // console.log("nodedragged", node.position);
      // console.log("editor", editor.view.area.transform);
    });

    window.electronAPI.handleMidiMessage((event, value) => {
      console.log("midi event", event);
      console.log("midi value", value);
    });
  }, []);

  return (
    <div className="app">
      <div className="panel">
        {selectedNode && (
          <Panel
            key={pannelState}
            node={selectedNode}
            editor={editor}
            rendererEmitter={rendererEmitter}
            uiConfigs={uiConfigs}
            crowRepl={null}
          />
        )}
      </div>
      <div className="rete">{editorComponent}</div>
    </div>
  );
}

window.electronAPI.getInitialData().then((data) => {
  initialData = data;
  config = data.config;
  buildConfig();
  const rootElement = document.getElementById("root");
  createRoot(rootElement).render(<App />);
});

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
