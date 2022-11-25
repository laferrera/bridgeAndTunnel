// looking here https://codesandbox.io/s/retejs-react-render-t899c?file=/src/rete.jsx:3766-3794
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from 'rete-connection-plugin';
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import AreaPlugin from "rete-area-plugin";
import ContextMenu from "efficy-rete-context-menu-plugin";
import HistoryPlugin from 'rete-history-plugin'
import keyboardPlugin from "./keyboardPlugin.js";

import { AddComponent } from "./AddComponent.jsx";
import { MIDIRecieveComponent } from "./MIDIRecieveComponent.jsx";
import { OSCEmitterComponent } from "./OSCEmitterComponent.jsx";

// class MIDIReceiveControl extends Rete.Control {
//   constructor(emitter, key, node, readonly = false) {
//     super(key);
//     this.emitter = emitter;
//     this.key = key;
//     // TODO turn this into a midicontrol component?
//     this.component = NumControl.component

//     const initial = node.data[key] || {};
//     node.data[key] = initial;
//     this.props = {
//       readonly,
//       value: initial,
//       onChange: (v) => {
//         this.setValue(v);
//         this.emitter.trigger('process')
//       }
//     }
//   }

//   setValue(val){
//     this.props.value = val;
//     this.putData(this.key,val);
//     this.emitter.update();
//   }


// }


export async function createEditor(container, emitter) {
  var components = [new MIDIRecieveComponent(), new AddComponent(), new OSCEmitterComponent()];
  let numSocket = new Rete.Socket("Number value");

  let editor = new Rete.NodeEditor('bridgeAndtunnel@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    // transformer: () => ([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]], // optional, custom transformer
    curve: ConnectionPathPlugin.curveBundle, // curve identifier
    options: { vertical: false, curvature: 0.0 }, // optional
  });
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(ContextMenu, {
    searchBar: false,
    delay: 5000
  });
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.5, max: 1 },
    translateExtent: { width: 500, height: 500 }
  });
  editor.use(keyboardPlugin);

  


  let engine = new Rete.Engine('bridgeAndtunnel@0.1.0');

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  var mr1 = await new MIDIRecieveComponent().createNode({ num: 2 });
  var mr2 = await new MIDIRecieveComponent().createNode({ num: 3 });
  var osc = await new OSCEmitterComponent().createNode({ num: 3 });
  var add = await components[1].createNode();

  mr1.position = [80, 200];
  mr2.position = [80, 400];
  osc.position = [500, 300];
  add.position = [500, 100];

  
  mr1.data.testConfig = {key:"value"}
  editor.addNode(mr1);
  editor.addNode(mr2);
  editor.addNode(osc);
  editor.addNode(add);

  editor.connect(mr1.outputs.get("num"), add.inputs.get("num1"));
  editor.connect(mr2.outputs.get("num"), add.inputs.get("num2"));

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
      await window.electronAPI.initializeNodes(editor.toJSON().nodes);
    }
  );

  editor.on("nodecreated noderemoved", async (node) => {
      window.electronAPI.addNode(editor.toJSON());
      emitter.emit('noderemoved', node);
    }
  );

  editor.on('nodeselected', (node) => {
    emitter.emit('nodeselect', node);
    console.log
  });
    
  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick';
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
  // AreaPlugin.restrictZoom();
  // https://github.com/retejs/area-plugin/blob/master/src/restrictor.js
  window.electronAPI.initializeNodes(editor.toJSON().nodes);


  editor.use(HistoryPlugin);
  return editor;
}

export function useRete(emitter) {
  const [container, setReteContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container, emitter).then((value) => {
        console.log("rete created");
        editorRef.current = value;
      });
    }
  }, [container]);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        console.log("rete destroy");
        editorRef.current.destroy();
      }
    };
  }, []);

  return [setReteContainer];
}
