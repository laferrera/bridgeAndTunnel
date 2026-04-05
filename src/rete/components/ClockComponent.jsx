import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/clockConfig.js";

export class ClockComponent extends BnTNode {
  constructor() {
    super("Clock");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);
    if (node.data._fired === undefined) node.data._fired = false;
    return node.addOutput(new Rete.Output("trigger", "Trigger", numSocket));
  }

  worker(node, inputs, outputs) {
    if (node.data._fired) {
      outputs["trigger"] = 1;
      node.data._fired = false;
    } else {
      outputs["trigger"] = 0;
    }
  }
}
