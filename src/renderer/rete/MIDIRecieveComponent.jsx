import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import { midiReceiveConfig } from "./midiRecieveConfig.js";


export class MIDIRecieveComponent extends Rete.Component {
  constructor() {
    super("MIDI Receive");
    this.data.component = btNode;
  }

  builder(node) {
    // we dont have any inputs for Recieve
    let out = new Rete.Output('num', "Number", numSocket);
    node.data.config = midiReceiveConfig;
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