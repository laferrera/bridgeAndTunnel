import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/randomConfig.js";

export class RandomComponent extends BnTNode {
  constructor() {
    super("Random");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);

    if (node.data._held === undefined) node.data._held = 0;
    if (node.data._prevTrigger === undefined) node.data._prevTrigger = 0;

    return node
      .addInput(new Rete.Input("trigger", "Trigger", numSocket))
      .addOutput(new Rete.Output("out", "Out", numSocket));
  }

  worker(node, inputs, outputs) {
    const trigger = inputs["trigger"].length ? inputs["trigger"][0] : 0;
    const min = node.data.config?.min?.value ?? 0;
    const max = node.data.config?.max?.value ?? 127;

    if (trigger && !node.data._prevTrigger) {
      node.data._held = min + Math.random() * (max - min);
    }

    node.data._prevTrigger = trigger;
    outputs["out"] = node.data._held;
  }
}
