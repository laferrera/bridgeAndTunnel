import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/abletonLinkConfig.js";

export class AbletonLinkComponent extends BnTNode {
  constructor() {
    super("Ableton Link");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);

    if (node.data._beat === undefined) node.data._beat = 0;
    if (node.data._phase === undefined) node.data._phase = 0;
    if (node.data._bpm === undefined) node.data._bpm = 120;
    if (node.data._trigger === undefined) node.data._trigger = 0;
    if (node.data._prevPhase === undefined) node.data._prevPhase = 0;

    return node
      .addOutput(new Rete.Output("beat", "Beat", numSocket))
      .addOutput(new Rete.Output("phase", "Phase", numSocket))
      .addOutput(new Rete.Output("bpm", "BPM", numSocket))
      .addOutput(new Rete.Output("trigger", "Trigger", numSocket));
  }

  worker(node, inputs, outputs) {
    outputs["beat"] = node.data._beat;
    outputs["phase"] = node.data._phase;
    outputs["bpm"] = node.data._bpm;
    outputs["trigger"] = node.data._trigger;
  }
}
