import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import  config  from "../../renderer/nodeConfigs/oscEmitterConfig.js";
import { multiInputs } from "./utils.js";
import { emitterEmitter } from "../emitterEmitter.js";
export class OSCEmitterComponent extends BnTNode {
  constructor() {
    super("OSC Emitter");
    this.path = ["OSC"];
  }

  builder(node) {
    super.builder(node, config);
    multiInputs(node.data.config.numInputs, node, numSocket);

    return node;
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