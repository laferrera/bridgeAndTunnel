import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import  config  from "../nodeConfigs/oscEmitterConfig.js";
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
    const inputCount = node.data.config.numInputs;
    node.data.oscValues = [];
    for (let i = 1; i <= inputCount; i++) {
      const input = inputs[`num${i}`];
      node.data.oscValues.push(input && input.length > 0 ? input[0] : 0);
    }
    if (!emitterEmitter.passive) emitterEmitter.emit("send-osc-message", node);
  }
}