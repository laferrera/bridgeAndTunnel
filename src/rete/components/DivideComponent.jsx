import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/mathConfig.js";

export class DivideComponent extends BnTNode {
  constructor() {
    super("Divide");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num1", "Input 1", numSocket))
      .addInput(new Rete.Input("num2", "Input 2", numSocket))
      .addOutput(new Rete.Output("quotient", "Quotient", numSocket));
  }

  worker(node, inputs, outputs) {
    const n1 = inputs["num1"].length ? inputs["num1"][0] : 0;
    const n2 = inputs["num2"].length ? inputs["num2"][0] : 0;
    outputs["quotient"] = n2 !== 0 ? n1 / n2 : 0;
  }
}
