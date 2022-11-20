import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Rete from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ReactRenderPlugin from 'rete-react-render-plugin';
import AreaPlugin from 'rete-area-plugin';

var numSocket = new Rete.Socket('Number value');

class MyReactControl extends React.Component {

  componentDidMount() {
    this.props.mounted();
  }

  render() {
    return (
      <input type="number" value={this.props.value} readOnly={this.props.readonly} onChange={e => this.props.onChange(+e.target.value)} />
    )
  }
}


class NumControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.render = 'react';
    this.component = MyReactControl;

    this.key = key;
    this.props = {
      value: '',
      onChange: v => {
        this.setValue(v),
          emitter.trigger('process');
      },
      readonly,
      mounted: () => this.setValue(this.getData(this.key))
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val)
    this.update();
  }
}

class NumComponent extends Rete.Component {

  constructor() {
    super("Number");
  }

  builder(node) {
    var out1 = new Rete.Output('num', "Number", numSocket);

    return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super("Add");
  }

  builder(node) {
    var inp1 = new Rete.Input('num', "Number", numSocket);
    var inp2 = new Rete.Input('num2', "Number2", numSocket);
    var out = new Rete.Output('num', "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, 'num'))
    inp2.addControl(new NumControl(this.editor, 'num2'))

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, 'preview', true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs['num'].length ? inputs['num'][0] : node.data.num1;
    var n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum);
    outputs['num'] = sum;
  }
}

(async () => {
  var container = document.querySelector('#rete');
  var components = [new NumComponent(), new AddComponent()];

  var editor = new Rete.NodeEditor('bridgeAndtunnel@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    // transformer: () => ([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]], // optional, custom transformer
    curve: ConnectionPathPlugin.curveBundle, // curve identifier
    options: { vertical: false, curvature: 0.0 }, // optional
  });
  editor.use(ReactRenderPlugin);
  editor.use(ContextMenuPlugin, {
    searchBar: false,
    delay: 5000
  });
  editor.use(AreaPlugin, { 
    scaleExtent: { min: 0.5, max: 1 } 
  });
  var engine = new Rete.Engine('bridgeAndtunnel@0.1.0');

  components.map(c => {
    editor.register(c);
    engine.register(c);
  });

  var n1 = await components[0].createNode({ num: 2 });
  var n2 = await components[0].createNode({ num: 0 });
  var add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];


  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get('num'), add.inputs.get('num'));
  editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

  editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
    console.log('process');
    await engine.abort();
    await engine.process(editor.toJSON());
  });

  editor.on('nodecreated noderemoved', async () => {
    window.electronAPI.nodeUpdate(editor.toJSON());
  });

  editor.on('zoom', ({ source }) => {
    console.log('Zoom:', source)
    return source !== 'dblclick';
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  // AreaPlugin.restrictZoom();
  // https://github.com/retejs/area-plugin/blob/master/src/restrictor.js
  editor.trigger('process');
})();

