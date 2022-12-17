import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { NumControl } from "./controls/NumControl.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/mathConfig.js";
import { deepCopy } from "./utils.js";
export class ConstantComponent extends Rete.Component {
  constructor() {
    super("Constant");
    this.data.component = btNode; // optional
    this.path = ["Math"];
  }

  builder(node) {
    var out = new Rete.Output("constant", "Constant", numSocket);
    node.data.config = deepCopy(config);
    
    return node
      // .addInput(inp1)
      .addControl(new NumControl(this.editor, "num", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["constant"] = node.data.num;
  }
}