import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import { ViewDisplayControl } from "./controls/ViewDisplayControl.jsx";
import { emitterEmitter } from "../emitterEmitter.js";
import config from "../nodeConfigs/mathConfig.js";

export class ViewComponent extends BnTNode {
  constructor() {
    super("View");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);

    return node
      .addInput(new Rete.Input("num", "Input", numSocket))
      .addControl(new ViewDisplayControl("display", node))
      .addOutput(new Rete.Output("num", "Passthrough", numSocket));
  }

  worker(node, inputs, outputs) {
    const num = inputs["num"].length ? inputs["num"][0] : 0;
    outputs["num"] = num;
    if (num !== node.data._lastDisplayed) {
      node.data._lastDisplayed = num;
      emitterEmitter.emit("view-node-update", { nodeId: node.id, value: num });
    }
  }
}
