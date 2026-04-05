import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/mathConfig.js";

export class RoundComponent extends BnTNode {
  constructor() {
    super("Round");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num", "Input", numSocket))
      .addOutput(new Rete.Output("out", "Rounded", numSocket));
  }

  worker(node, inputs, outputs) {
    const n = inputs["num"].length ? inputs["num"][0] : 0;
    outputs["out"] = Math.round(n);
  }
}
