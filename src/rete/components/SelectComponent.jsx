import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";

const config = { type: "selectConfig" };

export class SelectComponent extends BnTNode {
  constructor() {
    super("Select");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("a", "A", numSocket))
      .addInput(new Rete.Input("b", "B", numSocket))
      .addInput(new Rete.Input("control", "Control", numSocket))
      .addOutput(new Rete.Output("out", "Out", numSocket));
  }

  worker(node, inputs, outputs) {
    const a = inputs["a"].length ? inputs["a"][0] : 0;
    const b = inputs["b"].length ? inputs["b"][0] : 0;
    const control = inputs["control"].length ? inputs["control"][0] : 0;
    outputs["out"] = control ? b : a;
  }
}
