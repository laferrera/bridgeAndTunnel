import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/gateConfig.js";

export class GateComponent extends BnTNode {
  constructor() {
    super("Gate");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num", "Input", numSocket))
      .addOutput(new Rete.Output("out", "Out", numSocket));
  }

  worker(node, inputs, outputs) {
    const num = inputs["num"].length ? inputs["num"][0] : 0;
    const threshold = node.data.config.threshold.value;
    outputs["out"] = num > threshold ? 1 : 0;
  }
}
