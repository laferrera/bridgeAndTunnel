const EventEmitter = require("events");
const midiInput = require('./midi/midiInput.js');
const midiOutput = require('./midi/midiOutput.js');
const monomeGrid = require('monome-grid');
const OscEmitter = require('osc-emitter');
const OscReciever = require('osc-receiver');
const abletonlink = require('abletonlink');
const { DecodeStream } = require('@lachenmayer/midi-messages')
import { emitterEmitter } from "../rete/emitterEmitter.js";
const tempOSCPort = 10201;

import Rete from "rete";
import { AddComponent } from "../rete/AddComponent.jsx";
import { MIDIRecieveComponent } from "../rete/MIDIRecieveComponent.jsx";
import { OSCEmitterComponent } from "../rete/OSCEmitterComponent.jsx";
import { MonomeGridComponent } from "../rete/MonomeGridComponent.jsx";

class Engine extends EventEmitter{
  constructor(name) {
    super();
    this.name = name;
    this.nodes = {};
    this.midiInputs = []
    this.midiInputs.push(midiInput.init(this));
    this.midiOutputs = []
    this.midiOutputs.push(midiOutput.init(this));
    this.OSCEmitter = new OscEmitter();
    this.OSCEmitter.add('127.0.0.1', tempOSCPort);
    this.OscReciever = new OscReciever();
    // this.link = new abletonlink.Audio();
    this.decode = new DecodeStream();
    this.decode.on('data', message => { this.distributeMIDIMessage(message) });
    this.on('midi-message', (message) => { this.decodeMIDIMessage(message); });
    this.reteEngine = new Rete.Engine(name);
    this.reteEngine.on('error', ({ message, data }) => {
      this.alertErrorToRenderer(message, data);
    });
    this.setupMonomeGrid();
    this.monomeGridLed = []

    let components = [new MIDIRecieveComponent(), new AddComponent(), new OSCEmitterComponent(), new MonomeGridComponent()];
    components.map((c) => {
      this.reteEngine.register(c);
    });
    emitterEmitter.on('osc-message', (node) => { this.emitOSC(node); });
  }

  setupMonomeGrid(){
    monomeGrid().then(grid => {
      this.monomeGrid = grid;
      this.monomeGrid.key((x, y, s) => { this.distributeMonomeGridPress(x, y, s); });
      // todo, find grid x and y size
      for (let y = 0; y < 8; y++) {
        this.monomeGridLed[y] = Array.from(new Float32Array(16));
      }
      this.monomeGrid.refresh(this.monomeGridLed);
    });
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

  storeNodes(nodes){
    this.nodes = nodes;
  }

  getMIDIInputPorts(){
    let inputPorts = [["None", "none"]];
    for (var i = 0; i < this.midiInputs[0].getPortCount(); i++) {
      const portName = this.midiInputs[0].getPortName(i);
      console.log('midi input: ', portName);
      inputPorts.push([portName, portName]);
    }
    return inputPorts;
  }

  getMIDIOutputPorts() {
    let outputPorts = [["None", "none"]];
    for (var i = 0; i < this.midiOutputs[0].getPortCount(); i++) {
      const portName = this.midiOutputs[0].getPortName(i);
      console.log('midi output: ', portName);
      outputPorts.push([portName, portName]);
    }
    return outputPorts;
  }

  updateMIDIPorts(){
    let midiPorts = { midiInputs: this.getMIDIInputPorts(), midiOutputs: this.getMIDIOutputPorts() };
    this.mainWindow.webContents.send('midi-device-update', midiPorts);
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
    const args = node.data.oscValues;
    console.log('emit osc: ', node.id,' address: ', address, args);
    this.OSCEmitter.emit(address, args);
  }

  // handleOSCMessage(message, node){
  //   // type, channel, note, velocity
  //   switch (message.type) {
  //     case "NoteOn":
  //       console.log("note on : " + message.note, message.velocity);
  //       this.emitter.emit('/note_on', message.note, message.velocity);
  //       break;
  //     case "NoteOff":
  //       console.log("note off : " + message.note, message.velocity);
  //       this.emitter.emit('/note_off', message.note, message.velocity);
  //       break;
  //     default:
  //     // code block
  //   }
  // }

  distributeMonomeGridPress(x, y, state){
    this.updateMIDIPorts();
    console.log('grid press: ', x, y, state);
    this.monomeGridLed[y][x] = state * 15;
    this.monomeGrid.refresh(this.monomeGridLed);
    let grids = Object.values(this.nodes).filter(n => (n.name == "Grid"));
    grids.forEach(mg => {
      mg.data.x = x;
      mg.data.y = y;
      mg.data.state = state;
    })
    this.process(grids.map(mg => mg.id));
  }

}

export default Engine