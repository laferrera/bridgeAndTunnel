import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/quantizerConfig.js";
import { deepCopy } from "./utils.js";
export class QuantizerComponent extends Rete.Component {
  constructor() {
    super("Quantizer");
    this.data.component = btNode; // optional
    this.path = ["Math"];
  }

  builder(node) {
    var inp = new Rete.Input("input", "Input", numSocket);
    var shift = new Rete.Input("shift", "Shift", numSocket);
    var out = new Rete.Output("output", "Output", numSocket);
    node.data.config = deepCopy(config);
    
    return node.addInput(inp).addInput(shift).addOutput(out);
  }

  worker(node, inputs, outputs) {
    let inp = inputs["input"].length ? inputs["input"][0] : 0;
    let shift = inputs["shift"].length ? inputs["shift"][0] : 0;
    let scale = node.data.config.scale.value;
    if (!scale) { scale = [0];}

    const baseOctave = Math.floor((shift + inp) / scale.length);
    const scaleIndex = Math.abs((shift + inp) % scale.length);
    const note = parseInt(baseOctave * 12 + scale[scaleIndex]);

    outputs["output"] = note;
  }
}
