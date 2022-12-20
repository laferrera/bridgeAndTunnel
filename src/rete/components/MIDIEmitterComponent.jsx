import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/midiEmitterConfig.js";
import { emitterEmitter } from "../emitterEmitter.js";

export class MIDIEmitterComponent extends BnTNode {
  constructor() {
    super("MIDI Emitter");
    this.path = ["MIDI"];
  }

  builder(node) {
    super.builder(node, config);
    // we dont have any inputs for Recieve
    let noteIn = new Rete.Input("noteIn", "Note", numSocket);
    let velocityIn = new Rete.Input("velocityIn", "Velocity", numSocket);
    return node.addInput(noteIn).addInput(velocityIn);
  }

  worker(node, inputs, outputs) {
    node.data.noteIn = inputs["noteIn"].length ? inputs["noteIn"][0] : 0;
    node.data.velocityIn = inputs["velocityIn"].length
      ? inputs["velocityIn"][0]
      : 0;
    emitterEmitter.emit("engine:emit-midi-message", node);
  }
}
