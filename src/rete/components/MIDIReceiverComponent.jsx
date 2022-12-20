import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/midiReceiverConfig.js";

export class MIDIReceiverComponent extends BnTNode {
  constructor() {
    super("MIDI Receiver");
    this.path = ["MIDI"];
  }

  builder(node) {
    super.builder(node, config);
    // we dont have any inputs for Receive
    let noteOut = new Rete.Output("noteOut", "Note", numSocket);
    let velocityOut = new Rete.Output("velocityOut", "Velocity", numSocket);

    // let ctrl = new MIDIReceiveControl(this.editor, 'config', node);
    return (
      node
        // .addControl(ctrl)
        .addOutput(noteOut)
        .addOutput(velocityOut)
    );
  }

  worker(node, inputs, outputs) {
    // we dont have any inputs for Receive
    outputs["noteOut"] = node.data.noteOut;
    outputs["velocityOut"] = node.data.velocityOut;
  }
}
