import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import { midiSendConfig } from "../renderer/nodeConfigs/midiSendConfig.js";
import { configBuilder } from "./utils.js";

export class MIDISendComponent extends Rete.Component {
  constructor() {
    super("MIDI Send");
    this.data.component = btNode;
  }

  builder(node) {
    // we dont have any inputs for Recieve
    let noteIn = new Rete.Input('noteIn', 'Note', numSocket);
    let velocityIn = new Rete.Input('velocityIn', 'Velocity', numSocket);
    node.data.configType = Object.keys({ midiSendConfig }).pop()
    node.data.config = configBuilder(midiSendConfig);

    // let ctrl = new MIDIReceiveControl(this.editor, 'config', node);
    return node
      .addInput(noteIn)
      .addInput(velocityIn);

  }

  worker(node, inputs, outputs) {
    node.data.noteIn = inputs['noteIn'];
    node.data.velocityIn = inputs['velocityIn'];
    emitterEmitter.emit("send-midi-message", node);
  }

}