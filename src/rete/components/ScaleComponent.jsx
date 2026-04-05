import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/scaleConfig.js";

export class ScaleComponent extends BnTNode {
  constructor() {
    super("Scale");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num", "Input", numSocket))
      .addOutput(new Rete.Output("out", "Scaled", numSocket));
  }

  worker(node, inputs, outputs) {
    const num = inputs["num"].length ? inputs["num"][0] : 0;
    const inMin = node.data.config.inputMin.value;
    const inMax = node.data.config.inputMax.value;
    const outMin = node.data.config.outputMin.value;
    const outMax = node.data.config.outputMax.value;

    if (inMax === inMin) {
      outputs["out"] = outMin;
      return;
    }

    const scaled = outMin + ((num - inMin) * (outMax - outMin)) / (inMax - inMin);
    outputs["out"] = scaled;
  }
}
