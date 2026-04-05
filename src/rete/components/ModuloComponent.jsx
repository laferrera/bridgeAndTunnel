import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/mathConfig.js";

export class ModuloComponent extends BnTNode {
  constructor() {
    super("Modulo");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("num1", "Input", numSocket))
      .addInput(new Rete.Input("num2", "Divisor", numSocket))
      .addOutput(new Rete.Output("out", "Remainder", numSocket));
  }

  worker(node, inputs, outputs) {
    const n1 = inputs["num1"].length ? inputs["num1"][0] : 0;
    const n2 = inputs["num2"].length ? inputs["num2"][0] : 0;
    outputs["out"] = n2 !== 0 ? n1 % n2 : 0;
  }
}
