import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { NumControl } from "./NumControl.jsx";
import { numSocket } from "./numSocket.js";
import { quantizerConfig } from "../renderer/nodeConfigs/quantizerConfig.js";
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

    node.data.configType = Object.keys({ quantizerConfig }).pop();
    node.data.config = configBuilder(quantizerConfig);
    return node.addInput(inp).addInput(shift).addOutput(out);
  }

  worker(node, inputs, outputs) {
    let inp = inputs["input"].length ? inputs["input"][0] : 0;
    let shift = inputs["shift"].length ? inputs["shift"][0] : 0;
    // let scale = [0, 2, 3, 5, 7, 8, 10];
    let scale = node.data.config.scale.value;
    console.log('scale', scale)
    if (!scale) { scale = [0];}

    const baseOctave = Math.floor((shift + inp) / scale.length);
    const scaleIndex = Math.abs((shift + inp) % scale.length);
    const note = parseInt(baseOctave * 12 + scale[scaleIndex]);

    outputs["output"] = note;
  }
}
