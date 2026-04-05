import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/chordConfig.js";

const INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dom7:  [0, 4, 7, 10],
  maj7:  [0, 4, 7, 11],
  min7:  [0, 3, 7, 10],
  dim:   [0, 3, 6],
  aug:   [0, 4, 8],
  sus2:  [0, 2, 7],
  sus4:  [0, 5, 7],
  dim7:  [0, 3, 6, 9],
};

export class ChordComponent extends BnTNode {
  constructor() {
    super("Chord");
    this.path = ["Math"];
  }

  builder(node) {
    super.builder(node, config);
    return node
      .addInput(new Rete.Input("root", "Root", numSocket))
      .addOutput(new Rete.Output("note1", "Note 1", numSocket))
      .addOutput(new Rete.Output("note2", "Note 2", numSocket))
      .addOutput(new Rete.Output("note3", "Note 3", numSocket))
      .addOutput(new Rete.Output("note4", "Note 4", numSocket));
  }

  worker(node, inputs, outputs) {
    const root = inputs["root"].length ? inputs["root"][0] : 60;
    const chordType = node.data.config?.chordType?.value ?? "major";
    const intervals = INTERVALS[chordType] ?? INTERVALS.major;

    outputs["note1"] = root + (intervals[0] ?? 0);
    outputs["note2"] = root + (intervals[1] ?? 0);
    outputs["note3"] = root + (intervals[2] ?? 0);
    outputs["note4"] = root + (intervals[3] ?? 0);
  }
}
