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
    var outState = new Rete.Output("state", "State", numSocket);

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
      .addOutput(outState);
  }

  worker(node, inputs, outputs) {
    let x = inputs["x"].length ? inputs["x"][0] : 0;
    let y = inputs["y"].length ? inputs["y"][0] : 0;
    let state = inputs["state"].length ? inputs["state"][0] : 0;
 
    if (inputs["x"].length){ node.data.x = x; }
    if (inputs["y"].length) { node.data.y = y; }
    if (inputs["state"].length) { node.data.state = state; }

    outputs['x'] = node.data.x ? node.data.x : 0;
    outputs['y'] = node.data.y ? node.data.y : 0;
    outputs["state"] = node.data.press ? node.data.press : 0;
  }
}