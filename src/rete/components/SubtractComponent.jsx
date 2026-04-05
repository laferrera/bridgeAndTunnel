import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/mathConfig.js";

export class SubtractComponent extends BnTNode {
  constructor() {
    super("Subtract");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num1", "Input 1", numSocket))
      .addInput(new Rete.Input("num2", "Input 2", numSocket))
      .addOutput(new Rete.Output("difference", "Difference", numSocket));
  }

  worker(node, inputs, outputs) {
    const n1 = inputs["num1"].length ? inputs["num1"][0] : 0;
    const n2 = inputs["num2"].length ? inputs["num2"][0] : 0;
    outputs["difference"] = n1 - n2;
  }
}
