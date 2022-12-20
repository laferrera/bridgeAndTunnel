import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/monomeGridConfig.js";
import { checkInputsAndSetData } from "./utils.js";
export class MonomeGridComponent extends BnTNode {
  constructor() {
    super("Grid");
    this.path = ["Monome"];
  }

  builder(node) {
    super.builder(node, config);    
    var inpX = new Rete.Input("x", "X", numSocket);
    var inpY = new Rete.Input("y", "Y", numSocket);
    var inpState = new Rete.Input("state", "State", numSocket);
    var outX = new Rete.Output("x", "X", numSocket);
    var outY = new Rete.Output("y", "Y", numSocket);
    var outState = new Rete.Output("state", "State", numSocket);

    node.data.x = 0;
    node.data.y = 0;
    node.data.state = 0;

    return node
      .addInput(inpX)
      .addInput(inpY)
      .addInput(inpState)
      .addOutput(outX)
      .addOutput(outY)
      .addOutput(outState);
  }

  worker(node, inputs, outputs) {
    checkInputsAndSetData(inputs, node.data);
    console.log("grid node.data", node.data.x, node.data.y, node.data.state);
    outputs["x"] = node.data.x;
    outputs["y"] = node.data.y;
    outputs["state"] = node.data.state;
  }
}