import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import  config  from "../../renderer/nodeConfigs/oscEmitterConfig.js";
import { deepCopy } from "./utils.js";
import { emitterEmitter } from "../emitterEmitter.js";
export class OSCEmitterComponent extends Rete.Component {
  constructor() {
    super("OSC Emitter");
    this.data.component = btNode;
    this.path = ["OSC"];
  }

  builder(node) {
    let inp = new Rete.Input('num1', "Number", numSocket);
    // inp.addControl(new NumControl(this.editor, "num", node));
    if(!node.data.config) { node.data.config = deepCopy(config) }
    
    return node
      .addInput(inp);

  }

  worker(node, inputs, outputs) {
    // we dont have any output sockets for Emitter
    node.data.oscValues = [];
    Object.values(inputs).forEach((input) => {
      if (input.length > 0) {
        node.data.oscValues.push(input[0]);
      }
    });
    emitterEmitter.emit("send-osc-message", node);
  }

}