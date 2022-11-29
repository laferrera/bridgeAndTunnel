import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { NumControl } from "./NumControl.jsx";
import { numSocket } from "./numSocket.js";
import { midiReceiveConfig } from "../renderer/nodeConfigs/midiRecieveConfig.js";
import { configBuilder } from "./configBuilder.js";
export class MonomeGridComponent extends Rete.Component {
  constructor() {
    super("Grid");
    this.data.component = btNode; // optional
  }

  builder(node) {
    var inpX = new Rete.Input("x", "X", numSocket);
    var inpY = new Rete.Input("y", "Y", numSocket);
    var inpState = new Rete.Input("state", "State", numSocket);
    var outX = new Rete.Output("x", "X", numSocket);
    var outY = new Rete.Output("y", "Y", numSocket);
    var outPress = new Rete.Output("press", "Press", numSocket);

    // inp1.addControl(new NumControl(this.editor, "num1", node));
    // inp2.addControl(new NumControl(this.editor, "num2", node));

    node.data.configType = Object.keys({ midiReceiveConfig }).pop()
    node.data.config = configBuilder(midiReceiveConfig);
    return node
      .addInput(inpX)
      .addInput(inpY)
      .addInput(inpState)
      .addOutput(outX)
      .addOutput(outY)
      .addOutput(outPress);
  }

  worker(node, inputs, outputs) {
    // var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    // var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    let n1 = inputs["num1"].length ? inputs["num1"][0] : 0;
    let n2 = inputs["num2"].length ? inputs["num2"][0] : 0;
    let sum = n1 + n2;
    if (Number.isNaN(sum)) {
      sum = 0;
    };
    outputs["sum"] = sum;   
    console.log("sum", sum);
  }
}