import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/mathConfig.js";

export class SampleAndHoldComponent extends BnTNode {
  constructor() {
    super("Sample & Hold");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);

    if (node.data._held === undefined) node.data._held = 0;
    if (node.data._prevTrigger === undefined) node.data._prevTrigger = 0;

    return node
      .addInput(new Rete.Input("input", "Input", numSocket))
      .addInput(new Rete.Input("trigger", "Trigger", numSocket))
      .addOutput(new Rete.Output("out", "Out", numSocket));
  }

  worker(node, inputs, outputs) {
    const input = inputs["input"].length ? inputs["input"][0] : 0;
    const trigger = inputs["trigger"].length ? inputs["trigger"][0] : 0;

    if (trigger && !node.data._prevTrigger) {
      node.data._held = input;
    }

    node.data._prevTrigger = trigger;
    outputs["out"] = node.data._held;
  }
}
