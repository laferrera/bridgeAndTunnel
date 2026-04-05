import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";

const config = { type: "toggleConfig" };

export class ToggleComponent extends BnTNode {
  constructor() {
    super("Toggle");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);
    if (node.data._state === undefined) node.data._state = 0;
    if (node.data._prevTrigger === undefined) node.data._prevTrigger = 0;
    return node
      .addInput(new Rete.Input("trigger", "Trigger", numSocket))
      .addOutput(new Rete.Output("out", "Out", numSocket));
  }

  worker(node, inputs, outputs) {
    const trigger = inputs["trigger"].length ? inputs["trigger"][0] : 0;
    if (trigger && !node.data._prevTrigger) {
      node.data._state = node.data._state ? 0 : 1;
    }
    node.data._prevTrigger = trigger;
    outputs["out"] = node.data._state;
  }
}
