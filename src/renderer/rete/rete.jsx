// looking here https://codesandbox.io/s/retejs-react-render-t899c?file=/src/rete.jsx:3766-3794

import React, { useState, useEffect, useCallback, useRef } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from 'rete-connection-plugin';
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import AreaPlugin from "rete-area-plugin";
import ContextMenu from "efficy-rete-context-menu-plugin";
import { btNode } from "./btNode.jsx";

var numSocket = new Rete.Socket("Number value");

class NumControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="number"
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(+e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = NumControl.component;

    const initial = node.data[key] || 0;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    // this.update();
  }
}

class MIDIReceiveControl extends Rete.Control {
  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    // TODO turn this into a midicontrol component?
    this.component = NumControl.component

    const initial = node.data[key] || {};
    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger('process')
      }
    }
  }

  setValue(val){
    this.props.value = val;
    this.putData(this.key,val);
    this.emitter.update();
  }


}


class AddComponent extends Rete.Component {
  constructor() {
    super("Add");
    this.data.component = btNode; // optional
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var inp2 = new Rete.Input("num2", "Number2", numSocket);
    var out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}

class MIDIRecieveComponent extends Rete.Component {
  constructor() {
    super("MIDI Receive");
    this.data.component = btNode;
  }

  builder(node) {
    // we dont have any inputs for Recieve
    let out = new Rete.Output('num', "Number", numSocket);
    node.data.config = {};
    // let ctrl = new MIDIReceiveControl(this.editor, 'config', node);
    return node
      // .addControl(ctrl)
      .addOutput(out);
      
  }

  worker(node, inputs, outputs) {
    // we dont have any inputs for Recieve
    outputs['num'] = node.data.num;
  }

}


export async function createEditor(container) {
  var components = [new MIDIRecieveComponent(), new AddComponent()];

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
    delay: 50000
  });
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.5, max: 1 }
  });


  let engine = new Rete.Engine('bridgeAndtunnel@0.1.0');

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  var mr1 = await new MIDIRecieveComponent().createNode({ num: 2 });
  var mr2 = await components[0].createNode({ num: 3 });
  var add = await components[1].createNode();

  mr1.position = [80, 200];
  mr2.position = [80, 400];
  add.position = [500, 240];

  
  mr1.data.testConfig = {key:"value"}
  editor.addNode(mr1);
  editor.addNode(mr2);
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

  editor.on(
    "nodecreated noderemoved",
    async () => {
      window.electronAPI.addNode(editor.toJSON());
    }
  );

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

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
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

  return [setContainer];
}
