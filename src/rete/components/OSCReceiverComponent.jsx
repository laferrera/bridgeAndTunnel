import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/oscReceiverConfig.js";
import { multiOutputs } from "./utils.js";
export class OSCReceiverComponent extends BnTNode {
  constructor() {
    super("OSC Receiver");
    this.path = ["OSC"];
  }

  builder(node) {
    super.builder(node, config);
    multiOutputs(node.data.config.numOutputs, node, numSocket);

    node.data.oscValues = [];
    return node;
    // .addOutput(out);
  }

  worker(node, inputs, outputs) {
    let outputLength = Object.keys(node.outputs).length;
    node.data.oscValues.forEach((val, i) => {
      if (i < outputLength) {
        const outputKey = `num${i + 1}`;
        outputs[outputKey] = val;
      }
    });
  }
}