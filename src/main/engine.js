
const { app, Menu } = require('electron')
const EventEmitter = require("events");
const midiInput = require('./midi/midiInput.js');
import Rete from "rete";
import { AddComponent } from "../rete/AddComponent.jsx";
import { MIDIRecieveComponent } from "../rete/MIDIRecieveComponent.jsx";
import { OSCEmitterComponent } from "../rete/OSCEmitterComponent.jsx";
const OscEmitter = require('osc-emitter');
const OscReciever = require('osc-receiver');
const { DecodeStream } = require('@lachenmayer/midi-messages')
import { emitterEmitter } from "../rete/emitterEmitter.js";
const tempOSCPort = 10201;

class Engine extends EventEmitter{
  constructor(name) {
    super();
    this.name = name;
    this.nodes = {};
    this.midi = midiInput.init(this);
    this.OSCEmitter = new OscEmitter();
    this.OSCEmitter.add('127.0.0.1', tempOSCPort);
    this.decode = new DecodeStream();
    this.decode.on('data', message => { this.distributeMIDIMessage(message) });
    this.on('midi-message', (message) => { this.decodeMIDIMessage(message); });
    this.reteEngine = new Rete.Engine(name);
    this.reteEngine.on('error', ({ message, data }) => {
      this.alertErrorToRenderer(message, data);
    });
    let components = [new MIDIRecieveComponent(), new AddComponent(), new OSCEmitterComponent()];
    components.map((c) => {
      this.reteEngine.register(c);
    });

    emitterEmitter.on('osc-message', (node) => { this.emitOSC(node); });

  }

  processJSON(json){
    this.reteEngine.process(json);
  }

  process(nodeIds){
    let data = {id: this.name, nodes: this.nodes};
    nodeIds.forEach(id => {
      this.reteEngine.process(data, id);
    });
  }

  setMainWindow(mainWindow){
    this.mainWindow = mainWindow;
  }

  alertErrorToRenderer(message, data){
    this.mainWindow.webContents.send('engine-error', message, data);
  }

  display() {
    console.log(this.nodes);
  }

  addNode(node){
    this.nodes.push(node);
    // console.log(node);
  }

  updateNode(node){
    console.log(node);
    // this.nodes.find(n => n.id == node.id).controls.get('preview').setValue(node.data.num);
  }

  removeNode(node){
    this.nodes.splice(this.nodes.indexOf(node), 1);
  }

  initialzeNodes(nodes){
    this.nodes = nodes;
  }

  decodeMIDIMessage(message){
    this.decode.write(Buffer.from(message));
  }

  distributeMIDIMessage(message){
    console.log('midi message: ', message);
    let channel = message.channel;
    let midiReceivers = Object.values(this.nodes).filter(n => (n.name == "MIDI Receive" && n.data.config.channel.value == channel));
    midiReceivers.forEach(mr => {
      mr.data.noteOut = message.note;
      mr.data.velocityOut = message.velocity;
    })
    this.process(midiReceivers.map(mr => mr.id));
  }

  emitOSC(node){  
    const address = node.data.config.address.value;
    const args = node.data.num;
    console.log('emit osc: ', node.id, address, args);
    this.OSCEmitter.emit(address, args);
  }

  handleOSCMessage(message, node){
    // type, channel, note, velocity
    switch (message.type) {
      case "NoteOn":
        console.log("note on : " + message.note, message.velocity);
        this.emitter.emit('/note_on', message.note, message.velocity);
        break;
      case "NoteOff":
        console.log("note off : " + message.note, message.velocity);
        this.emitter.emit('/note_off', message.note, message.velocity);
        break;
      default:
      // code block
    }
  }

}

export default Engine