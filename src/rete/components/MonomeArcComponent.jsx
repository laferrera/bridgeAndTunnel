import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/monomeArcConfig.js";
import { emitterEmitter } from "../emitterEmitter.js";

export class MonomeArcComponent extends BnTNode {
  constructor() {
    super("Arc");
    this.path = ["Monome"];
  }

  builder(node) {
    super.builder(node, config);
    for (let i = 0; i < 4; i++) {
      node.addOutput(new Rete.Output(`delta${i}`, `Δ ${i + 1}`, numSocket));
    }
    for (let i = 0; i < 4; i++) {
      node.addInput(new Rete.Input(`ring${i}`, `Ring ${i + 1}`, numSocket));
    }
    node.data.delta = [0, 0, 0, 0];
    return node;
  }

  worker(node, inputs, outputs) {
    const delta = node.data.delta || [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      outputs[`delta${i}`] = delta[i];
    }
    // Clear after read — delta is momentary, not persistent
    node.data.delta = [0, 0, 0, 0];
    // Drive ring LEDs from inputs
    for (let i = 0; i < 4; i++) {
      const vals = inputs[`ring${i}`];
      if (vals && vals.length > 0 && vals[0] !== undefined) {
        emitterEmitter.emit("arc:set-ring", { n: i, level: vals[0] });
      }
    }
  }
}
