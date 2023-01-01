// looking here https://codesandbox.io/s/retejs-react-render-t899c?file=/src/rete.jsx:3766-3794
// import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin, { ReactMenu } from "rete-context-menu-plugin-react";
// import ContextMenuPlugin, { ReactMenu } from "./plugins/context-menu-plugin.js";
// import HistoryPlugin from "rete-history-plugin";
import HistoryPlugin from "./plugins/history-plugin.js";
import KeyboardPlugin from "./plugins/keyboard-plugin.js";
import MultiSelectPlugin from "./plugins/multi-select-plugin.js";
import DragSelectionPlugin from "./plugins/drag-selection-plugin.js";
import { numSocket } from "./components/numSocket.js";
import { reteComponents } from "./components/index.js";
// import DataChangeAction from "./plugins/data-change-action.js";

const min = (arr) => (arr.length === 0 ? 0 : Math.min(...arr));
const max = (arr) => (arr.length === 0 ? 0 : Math.max(...arr));

export function createEditor(container, rendererEmitter, editorRef) {
  let editor = new Rete.NodeEditor("bridgeAndtunnel@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    curve: ConnectionPathPlugin.curveBundle, // curve identifier
    options: { vertical: false, curvature: 0 }, // optional
  });
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenuPlugin, {
    Menu: ReactMenu, // required
    searchBar: false, // true by default
    searchKeep: (title) => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    delay: 100,
    nodeItems: (node) => {
      switch (node.name) {
        case "OSC Emitter":
          return {
            "Add Input"() {
              rendererEmitter.emit("addInput", node);
            },
            "Remove Input"() {
              rendererEmitter.emit("removeInput", node);
            },
          };
        case "OSC Receiver":
          return {
            "Add Output"() {
              rendererEmitter.emit("addOutput", node);
            },
            "Remove Output"() {
              rendererEmitter.emit("removeOutput", node);
            },
          };
        default:
          return {
            "Click me"() {
              console.log("Works for node!");
            },
          };
      }
    },
    allocate(component) {
      return component.path;
    },
  });

  editor.use(AreaPlugin, {
    // scaleExtent: { min: 0.5, max: 1 },
    // translateExtent: { width: 500, height: 500 },
  });
  editor.use(KeyboardPlugin);
  editor.use(MultiSelectPlugin);
  editor.use(DragSelectionPlugin, { enabled: true });

  reteComponents.map((c) => {
    editor.register(c);
  });

  editor.use(HistoryPlugin, { keyboard: false });

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // should this be ASYNC?
      // TODO, add history...
      editor.sendSessionToMain();
    }
  );

  editor.sendSessionToMain = () =>{
    const data = {editor: editor.toJSON(), history: editor.getHistoryJSON()};
    window.electronAPI.storeSession(data);
  }

  editor.zoomToNodes = () => {
    AreaPlugin.zoomAt(editor, editor.nodes);
  };


  editor.containNodesToEditorView = (node) => {
    const transform = editor.view.area.transform;
    const areaStart = {x: (0 - transform.x) / (.9 * transform.k),
                       y: (0 - transform.y) / (.95 * transform.k)};
    const areaEnd = {x: (editor.view.container.offsetWidth - transform.x) / (.95 * transform.k), 
                     y: (editor.view.container.offsetHeight - transform.y) / (.95 * transform.k)};
    const inside = node.position[0] >= areaStart.x 
                   && node.position[0] <= areaEnd.x 
                   && node.position[1] >= areaStart.y 
                   && node.position[1] <= areaEnd.y;
    if(!inside){
      editor.zoomToNodes();
    }
  };

  rendererEmitter.on("addInput", (node) => {
    let inputLength = node.data.config.numInputs;
    inputLength++;
    let inp = new Rete.Input("num" + inputLength, "Number", numSocket);
    node.addInput(inp);
    node.update();
    node.data.config.numInputs = inputLength;
  });

  rendererEmitter.on("removeInput", (node) => {
    let inputLength = Array.from(node.inputs).length;
    if (inputLength > 1) {
      let inp = Array.from(node.inputs).pop()[1];
      node.removeInput(inp);
      node.update();
      node.data.config.numInputs = inputLength--;
    }
  });

  rendererEmitter.on("addOutput", (node) => {
    // let outputLength = Array.from(node.outputs).length;
    let outputLength = node.data.config.numOutputs;
    outputLength++;
    let out = new Rete.Output("num" + outputLength, "Number", numSocket);
    node.addOutput(out);
    node.update();
    node.data.config.numOutputs = outputLength;
  });

  rendererEmitter.on("removeOutput", (node) => {
    let outputLength = Array.from(node.outputs).length;
    if (outputLength > 1) {
      let out = Array.from(node.outputs).pop()[1];
      node.removeOutput(out);
      node.update();
      node.data.config.numOutputs = outputLength--;
    }
  });

  editor.on("zoom", ({ translate, zoom, source }) => {
    // console.log(zoom);
    return source !== "dblclick";
  });

  editor.view.container.firstElementChild.classList.add("editor");

  editor.view.resize();
  // AreaPlugin.zoomAt(editor);
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
  // AreaPlugin.restrictZoom();
  // https://github.com/retejs/area-plugin/blob/master/src/restrictor.js

  editor.sendSessionToMain();
  editorRef.current = editor;
  return editor;
}
