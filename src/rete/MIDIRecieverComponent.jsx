import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import { midiReceiverConfig } from "../renderer/nodeConfigs/midiReceiverConfig.js";
import { configBuilder } from "./utils.js";
import { NumControl } from "./NumControl.jsx";

export class MIDIRecieverComponent extends Rete.Component {
  constructor() {
    super("MIDI Receiver");
    this.data.component = btNode;
  }

  builder(node) {
    // we dont have any inputs for Recieve
    let noteOut = new Rete.Output("noteOut", "Note", numSocket);
    let velocityOut = new Rete.Output("velocityOut", "Velocity", numSocket);
    node.data.configType = Object.keys({ midiReceiverConfig }).pop();
    node.data.config = configBuilder(midiReceiverConfig);

    // let ctrl = new MIDIReceiveControl(this.editor, 'config', node);
    return (
      node
        // .addControl(ctrl)
        .addOutput(noteOut)
        .addOutput(velocityOut)
    );
  }

  worker(node, inputs, outputs) {
    // we dont have any inputs for Recieve
    outputs["noteOut"] = node.data.noteOut;
    outputs["velocityOut"] = node.data.velocityOut;
  }
}
