import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { NumControl } from "./NumControl.jsx";
import { numSocket } from "./numSocket.js";
import { mathConfig } from "../renderer/nodeConfigs/mathConfig.js";
import { configBuilder } from "./utils.js";
export class ConstantComponent extends Rete.Component {
  constructor() {
    super("Constant");
    this.data.component = btNode; // optional
  }

  builder(node) {
    var out = new Rete.Output("constant", "Constant", numSocket);
    // var inp1 = new Rete.Input("num1", "Input 1", numSocket);
    // inp1.addControl(new NumControl(this.editor, "constant", node));
    // inp2.addControl(new NumControl(this.editor, "num2", node));

    node.data.configType = Object.keys({ mathConfig }).pop();
    node.data.config = configBuilder(mathConfig);
    return node
      // .addInput(inp1)
      .addControl(new NumControl(this.editor, "num", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["constant"] = node.data.num;
  }
}