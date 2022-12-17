import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../renderer/nodeConfigs/oscEmitterConfig.js";
import { configBuilder, checkInputsAndSetData } from "./utils.js";
export class OSCReceiverComponent extends Rete.Component {
  constructor() {
    super("OSC Receiver");
    this.data.component = btNode;
    this.path = ["OSC"];
  }

  builder(node) {
    let out = new Rete.Output('num1', "Number", numSocket);
    // inp.addControl(new NumControl(this.editor, "num", node));
    node.data.configType = Object.keys({ config }).pop();
    node.data.config = configBuilder(config);
    return node
      .addOutput(out);

  }

  worker(node, inputs, outputs) {
      Object.keys(outputs).forEach((key) => {
        if (outputs[key].length && outputs[key][0] !== node.data[key]) {
          changed = true;
          node.data[key] = outputs[key][0];
        }
      });
  }

}