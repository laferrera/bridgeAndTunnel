import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/mathConfig.js";
import { deepCopy } from "./utils.js";
export class MultiplyComponent extends Rete.Component {
  constructor() {
    super("Multiply");
    this.data.component = btNode; // optional
    this.path = ["Math"];
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "Input 1", numSocket);
    var inp2 = new Rete.Input("num2", "Input 2", numSocket);
    var out = new Rete.Output("product", "Product", numSocket);
    if(!node.data.config) { node.data.config = deepCopy(config) }
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
    let product = n1 * n2;
    if (Number.isNaN(product)) {
      product = 0;
    }
    outputs["product"] = product;
  }
}
