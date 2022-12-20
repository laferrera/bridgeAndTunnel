import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import { NumControl } from "./controls/NumControl.jsx";
export class ConstantComponent extends BnTNode {
  constructor() {
    super("Constant");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    var out = new Rete.Output("constant", "Constant", numSocket);

    return (
      node
        // .addInput(inp1)
        .addControl(new NumControl(this.editor, "num", node, true))
        .addOutput(out)
    );
  }

  worker(node, inputs, outputs) {
    outputs["constant"] = node.data.num;
  }
}