import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import { oscEmitterConfig } from "./oscEmitterConfig.js";


export class OSCEmitterComponent extends Rete.Component {
  constructor() {
    super("OSC Emitter");
    this.data.component = btNode;
  }

  builder(node) {
    let inp = new Rete.Input('num', "Number", numSocket);
    // inp.addControl(new NumControl(this.editor, "num", node));
    node.data.config = oscEmitterConfig;
    return node
      .addInput(inp);

  }

  worker(node, inputs, outputs) {
    // we dont have any inputs for Recieve
    inputs['num'] = node.data.num;
  }

}