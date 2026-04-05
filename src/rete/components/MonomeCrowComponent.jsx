import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/monomeCrowConfig.js";
import { multiInputs, multiOutputs } from "./utils.js";
import { emitterEmitter } from "../emitterEmitter.js";

export class MonomeCrowComponent extends BnTNode {
  constructor() {
    super("Crow");
    this.path = ["Monome"];
  }

  builder(node) {
    super.builder(node, config);
    multiInputs(node.data.config.numInputs, node, numSocket);
    multiOutputs(node.data.config.numOutputs, node, numSocket);

    return node;
  }

  worker(node, inputs, outputs) {
    const voltages = node.data.voltages || [];
    const numOutputs = node.data.config?.numOutputs ?? 1;
    for (let i = 0; i < numOutputs; i++) {
      outputs[`num${i + 1}`] = voltages[i] ?? 0;
    }
    const numInputs = node.data.config?.numInputs ?? 1;
    for (let i = 0; i < numInputs; i++) {
      const vals = inputs[`num${i + 1}`];
      if (vals && vals.length > 0 && vals[0] !== undefined) {
        emitterEmitter.emit("crow:set-output", { outputNum: i + 1, voltage: vals[0] });
      }
    }
  }
}
