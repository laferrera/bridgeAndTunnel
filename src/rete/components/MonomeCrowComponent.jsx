import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/monomeCrowConfig.js";
import { multiInputs, multiOutputs } from "./utils.js";

export class MonomeCrowComponent extends BnTNode {
  constructor() {
    super("Crow");
    this.path = ["Monome"];
  }

  builder(node) {
    super.builder(node, config);
    multiInputs(node.data.config.numInputs, node, numSocket);
    multiOutputs(node.data.config.numOutputs, node, numSocket);

    node.data.x = 0;
    node.data.y = 0;
    node.data.state = 0;
    return node;
  }

  worker(node, inputs, outputs) {
    // checkInputsAndSetData(inputs,node.data);
    // outputs['x'] = node.data.x;
    // outputs['y'] = node.data.y;
    // outputs["state"] = node.data.state;
  }
}
