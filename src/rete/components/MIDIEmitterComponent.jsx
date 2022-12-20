import Rete from "rete";
import { btNode } from "./btNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../../renderer/nodeConfigs/midiEmitterConfig.js";
import { deepCopy } from "./utils.js";
import { emitterEmitter } from "../emitterEmitter.js";

export class MIDIEmitterComponent extends Rete.Component {
  constructor() {
    super("MIDI Emitter");
    this.data.component = btNode;
    this.path = ["MIDI"];
  }

  builder(node) {
    // we dont have any inputs for Recieve
    let noteIn = new Rete.Input("noteIn", "Note", numSocket);
    let velocityIn = new Rete.Input("velocityIn", "Velocity", numSocket);
    console.log("node.data.config", node.data.config);
    if(!node.data.config) { node.data.config = deepCopy(config) }

    // let ctrl = new MIDIReceiveControl(this.editor, 'config', node);
    return node.addInput(noteIn).addInput(velocityIn);
  }

  worker(node, inputs, outputs) {
    node.data.noteIn = inputs["noteIn"].length ? inputs["noteIn"][0] : 0;
    node.data.velocityIn = inputs["velocityIn"].length ? inputs["velocityIn"][0] : 0;
    emitterEmitter.emit("engine:emit-midi-message", node);
  }
}
