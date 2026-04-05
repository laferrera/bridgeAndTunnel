import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import { ButtonControl } from "./controls/ButtonControl.jsx";
import config from "../nodeConfigs/mathConfig.js";

export class TriggerComponent extends BnTNode {
  constructor() {
    super("Trigger");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);
    if (node.data.fired === undefined) node.data.fired = false;

    return node
      .addControl(new ButtonControl(this.editor, "fired", node, "Trigger"))
      .addOutput(new Rete.Output("trigger", "Trigger", numSocket));
  }

  worker(node, inputs, outputs) {
    if (node.data.fired) {
      outputs["trigger"] = 1;
      node.data.fired = false;
    } else {
      outputs["trigger"] = 0;
    }
  }
}
