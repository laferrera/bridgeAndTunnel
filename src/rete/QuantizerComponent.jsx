import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { NumControl } from "./NumControl.jsx";
import { numSocket } from "./numSocket.js";
import { mathConfig } from "../renderer/nodeConfigs/mathConfig.js";
import { configBuilder } from "./utils.js";
export class QuantizerComponent extends Rete.Component {
  constructor() {
    super("Quantizer");
    this.data.component = btNode; // optional
  }

  builder(node) {
    var inp = new Rete.Input("input", "Input", numSocket);
    var shift = new Rete.Input("shift", "Shift", numSocket);
    var out = new Rete.Output("output", "Output", numSocket);

    node.data.configType = Object.keys({ mathConfig }).pop();
    node.data.config = configBuilder(mathConfig);
    return node.addInput(inp).addInput(shift).addOutput(out);
  }

  worker(node, inputs, outputs) {
    let inp = inputs["input"].length ? inputs["input"][0] : 0;
    let shift = inputs["shift"].length ? inputs["shift"][0] : 0;
    let scale = [0, 2, 3, 5, 7, 8, 10];
    if (scale.length === 0) {
      scale = [0];
    }

    const base = Math.floor((shift + inp) / scale.length);
    const scaleIndex = Math.abs((shift + inp) % scale.length);
    const note = parseInt(base * 12 + scale[scaleIndex]);

    outputs["output"] = note;
  }
}
