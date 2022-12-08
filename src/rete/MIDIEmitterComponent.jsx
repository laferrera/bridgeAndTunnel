import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import { midiEmitterConfig } from "../renderer/nodeConfigs/midiEmitterConfig.js";
import { configBuilder } from "./utils.js";
import { emitterEmitter } from "./emitterEmitter.js";

export class MIDIEmitterComponent extends Rete.Component {
  constructor() {
    super("MIDI Emitter");
    this.data.component = btNode;
  }

  builder(node) {
    // we dont have any inputs for Recieve
    let noteIn = new Rete.Input('noteIn', 'Note', numSocket);
    let velocityIn = new Rete.Input('velocityIn', 'Velocity', numSocket);
    node.data.configType = Object.keys({ midiEmitterConfig }).pop()
    node.data.config = configBuilder(midiEmitterConfig);

    // let ctrl = new MIDIReceiveControl(this.editor, 'config', node);
    return node
      .addInput(noteIn)
      .addInput(velocityIn);

  }

  worker(node, inputs, outputs) {
    node.data.noteIn = inputs['noteIn'][0];
    node.data.velocityIn = inputs['velocityIn'][0];
    emitterEmitter.emit("engine:emit-midi-message", node);
  }

}