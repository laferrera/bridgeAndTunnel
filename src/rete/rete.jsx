// looking here https://codesandbox.io/s/retejs-react-render-t899c?file=/src/rete.jsx:3766-3794
// import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin, { ReactMenu } from "rete-context-menu-plugin-react";
import HistoryPlugin from "rete-history-plugin";
import KeyboardPlugin from "./plugins/keyboard-plugin.js";
import MultiSelectPlugin from "./plugins/multi-select-plugin.js";
// import DataChangeAction from "./plugins/data-change-action.js";

import { numSocket } from "./numSocket.js";
import { AddComponent } from "./AddComponent.jsx";
import { reteComponents } from "./index.js";

const min = (arr) => (arr.length === 0 ? 0 : Math.min(...arr));
const max = (arr) => (arr.length === 0 ? 0 : Math.max(...arr));

export function createEditor(container, rendererEmitter, editorRef) {
  let editor = new Rete.NodeEditor("bridgeAndtunnel@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    // transformer: () => ([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]], // optional, custom transformer
    curve: ConnectionPathPlugin.curveBundle, // curve identifier
    options: { vertical: false, curvature: 0.0 }, // optional
  });
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenuPlugin, {
    Menu: ReactMenu, // required
    searchBar: false, // true by default
    searchKeep: (title) => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    delay: 100,
    // allocate(component) {
    //   return ['Submenu'];
    // },
    rename(component) {
      return component.name;
    },
    items: {
      "Click me"() {
        console.log("Works!");
      },
    },
    nodeItems: {
      "Click me"() {
        console.log("Works for node!");
      },
    },
    // nodeItems: node => {
    //   if (node.name === 'Add') {
    //     return {
    //       'Only for Add nodes'() { console.log('Works for add node!') },
    //     }
    //   } else {
    //     return {
    //       'Click me'() { console.log('Works for node!') }
    //     }
    //   }
    // }
  });

  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.5, max: 1 },
    translateExtent: { width: 500, height: 500 },
  });
  editor.use(KeyboardPlugin);
  editor.use(MultiSelectPlugin);

  reteComponents.map((c) => {
    editor.register(c);
  });

  editor.use(HistoryPlugin);

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // should this be ASYNC?
      await window.electronAPI.sendNodesToMain(editor.toJSON().nodes);
      // TODO, add history...
      await window.electronAPI.storeSession(editor.toJSON());
    }
  );

  // emitter callbacks

  editor.zoomToNodes = () => {
    console.log("zoomin");
    AreaPlugin.zoomAt(editor, editor.nodes);
  };

  editor.containNodesToEditorView = (node) => {
      const [nX, nY] = node.position;
      const eX = editor.view.area.transform.x;
      const eY = editor.view.area.transform.y;
      if( eX - Math.abs(nX) < 0 || eY - Math.abs(nY) < 0) {
        // editor.zoomToNodes();
      }
  }

  rendererEmitter.on("addInput", (node) => {
    let inputLength = Array.from(node.inputs).length;
    inputLength++;
    let inp = new Rete.Input("num" + inputLength, "Number", numSocket);
    node.addInput(inp);
    node.update();
  });

  rendererEmitter.on("removeInput", (node) => {
    let inputLength = Array.from(node.inputs).length;
    if (inputLength > 1) {
      let inp = Array.from(node.inputs).pop()[1];
      node.removeInput(inp);
      node.update();
    }
  });

  editor.on("zoom", ({ source }) => {
    return source !== "dblclick";
  });

  editor.view.resize();
  // AreaPlugin.zoomAt(editor);
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
  // AreaPlugin.restrictZoom();
  // https://github.com/retejs/area-plugin/blob/master/src/restrictor.js

  window.electronAPI.sendNodesToMain(editor.toJSON().nodes);
  console.log("rete editor created");

  editorRef.current = editor;
  return editor;
}
