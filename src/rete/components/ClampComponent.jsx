import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/clampConfig.js";

export class ClampComponent extends BnTNode {
  constructor() {
    super("Clamp");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num", "Input", numSocket))
      .addOutput(new Rete.Output("out", "Clamped", numSocket));
  }

  worker(node, inputs, outputs) {
    const num = inputs["num"].length ? inputs["num"][0] : 0;
    const min = node.data.config.min.value;
    const max = node.data.config.max.value;
    outputs["out"] = Math.min(Math.max(num, min), max);
  }
}
