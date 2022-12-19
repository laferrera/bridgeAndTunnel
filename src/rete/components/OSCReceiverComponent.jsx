import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/oscReceiverConfig.js";
import { deepCopy } from "./utils.js";
export class OSCReceiverComponent extends Rete.Component {
  constructor() {
    super("OSC Receiver");
    this.data.component = btNode;
    this.path = ["OSC"];
  }

  builder(node) {
    let out = new Rete.Output('num1', "Number", numSocket);
    node.data.config = deepCopy(config);
    return node
      .addOutput(out);

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