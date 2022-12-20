import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/mathConfig.js";

export class AddComponent extends BnTNode {
  constructor() {
    super("Add");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    var inp1 = new Rete.Input("num1", "Input 1", numSocket);
    var inp2 = new Rete.Input("num2", "Input 2", numSocket);
    var out = new Rete.Output("sum", "Sum", numSocket);

    return (
      node
        .addInput(inp1)
        .addInput(inp2)
        // .addControl(new NumControl(this.editor, "preview", node, true))
        .addOutput(out)
    );
  }

  worker(node, inputs, outputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : 0;
    let n2 = inputs["num2"].length ? inputs["num2"][0] : 0;
    let sum = n1 + n2;
    if (Number.isNaN(sum)) {
      sum = 0;
    }
    outputs["sum"] = sum;
  }
}