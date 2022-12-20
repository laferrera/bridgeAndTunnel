import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/quantizerConfig.js";
export class QuantizerComponent extends BnTNode {
  constructor() {
    super("Quantizer");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    var inp = new Rete.Input("input", "Input", numSocket);
    var shift = new Rete.Input("shift", "Shift", numSocket);
    var out = new Rete.Output("output", "Output", numSocket);

    return node.addInput(inp).addInput(shift).addOutput(out);
  }

  worker(node, inputs, outputs) {
    let inp = inputs["input"].length ? inputs["input"][0] : 0;
    let shift = inputs["shift"].length ? inputs["shift"][0] : 0;
    let scale = node.data.config.scale.value;
    if (!scale) {
      scale = [0];
    }

    const baseOctave = Math.floor((shift + inp) / scale.length);
    const scaleIndex = Math.abs((shift + inp) % scale.length);
    const note = parseInt(baseOctave * 12 + scale[scaleIndex]);

    outputs["output"] = note;
  }
}
