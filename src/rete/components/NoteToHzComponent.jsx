import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/mathConfig.js";

export class NoteToHzComponent extends BnTNode {
  constructor() {
    super("Note → Hz");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("note", "Note", numSocket))
      .addOutput(new Rete.Output("out", "Hz", numSocket));
  }

  worker(node, inputs, outputs) {
    const note = inputs["note"].length ? inputs["note"][0] : 69;
    outputs["out"] = 440 * Math.pow(2, (note - 69) / 12);
  }
}
