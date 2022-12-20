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
    // let inp = new Rete.Input('num1', "Number", numSocket);
    console.log("osc emitter node", node)
    if(!node.data.config) { node.data.config = deepCopy(config) }
    
    [...Array(node.data.config.numInputs)].forEach((_, i) => {
      let inp = new Rete.Input(`num${i + 1}`, "Number", numSocket);
      node.addInput(inp);
    });

    return node

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