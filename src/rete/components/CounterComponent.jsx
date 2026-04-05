import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/counterConfig.js";

export class CounterComponent extends BnTNode {
  constructor() {
    super("Counter");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);

    // Initialize state
    if (node.data._count === undefined) node.data._count = 0;
    if (node.data._prevTrigger === undefined) node.data._prevTrigger = 0;
    if (node.data._prevReset === undefined) node.data._prevReset = 0;

    return node
      .addInput(new Rete.Input("trigger", "Trigger", numSocket))
      .addInput(new Rete.Input("reset", "Reset", numSocket))
      .addOutput(new Rete.Output("count", "Count", numSocket));
  }

  worker(node, inputs, outputs) {
    const trigger = inputs["trigger"].length ? inputs["trigger"][0] : 0;
    const reset = inputs["reset"].length ? inputs["reset"][0] : 0;
    const max = node.data.config.max.value;
    const step = node.data.config.step.value;

    // Rising edge on reset → go back to 0
    if (reset && !node.data._prevReset) {
      node.data._count = 0;
    }
    // Rising edge on trigger → increment and wrap
    else if (trigger && !node.data._prevTrigger) {
      node.data._count = (node.data._count + step) % max;
    }

    node.data._prevTrigger = trigger;
    node.data._prevReset = reset;

    outputs["count"] = node.data._count;
  }
}
