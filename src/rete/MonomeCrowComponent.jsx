import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import { monomCrowConfig } from "../renderer/nodeConfigs/monomCrowConfig.js";
import { configBuilder, checkInputsAndSetData } from "./utils.js";

export class MonomeCrowComponent extends Rete.Component {
  constructor() {
    super("Crow");
    this.data.component = btNode; // optional
  }

  builder(node) {
    var trig1 = new Rete.Input("trig1", "Trigger 1", numSocket);
    var inp1 = new Rete.Input("inp1", "Input 1", numSocket);
    var trig2 = new Rete.Input("trig2", "Trigger 2", numSocket);
    var inp2 = new Rete.Input("inp2", "Input 2", numSocket);
    var trig3 = new Rete.Input("trig3", "Trigger 3", numSocket);
    var inp3 = new Rete.Input("inp3", "Input 3", numSocket);
    var trig4 = new Rete.Input("trig4", "Trigger 4", numSocket);
    var inp4 = new Rete.Input("inp4", "Input 4", numSocket);

    var out1 = new Rete.Output("out1", "Output 1", numSocket);
    var out2 = new Rete.Output("out2", "Output 2", numSocket);

    node.data.configType = Object.keys({ monomCrowConfig }).pop();
    node.data.config = configBuilder(monomCrowConfig);
    node.data.x = 0;
    node.data.y = 0;
    node.data.state = 0;
    return node
      .addInput(trig1)
      .addInput(inp1)
      .addInput(trig2)
      .addInput(inp2)
      .addInput(trig3)
      .addInput(inp3)
      .addInput(trig4)
      .addInput(inp4)
      .addOutput(out1)
      .addOutput(out2);

  }

  worker(node, inputs, outputs) {
    // checkInputsAndSetData(inputs,node.data);
    // outputs['x'] = node.data.x;
    // outputs['y'] = node.data.y;
    // outputs["state"] = node.data.state;
  }
}
