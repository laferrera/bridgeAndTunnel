const EventEmitter = require("events");
const midi = require("midi");
const midiInputStream = require("./midi/midiInputStream.js");
const midiOutputStream = require("./midi/midiOutputStream.js");
const monomeGrid = require("monome-grid");
const OscEmitter = require("osc-emitter");
const OscReciever = require("osc-receiver");
const abletonlink = require("abletonlink");
const { DecodeStream } = require("@lachenmayer/midi-messages");
import { emitterEmitter } from "../rete/emitterEmitter.js";
const tempOSCPort = 10201;

import Rete from "rete";
import { reteComponents } from "../rete/index.js";
class Engine extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.nodes = {};
    this.midiInputStreams = [];
    this.midiInputStreams.push(midiInputStream.init(this, "Bridge & Tunnel"));
    this.midiInput = new midi.Input();
    this.midiOutputStreams = [];
    this.midiOutputStreams.push(midiOutputStream.init(this, "Bridge & Tunnel"));
    this.midiOutput = new midi.Output();
    this.OSCEmitter = new OscEmitter();
    this.OSCEmitter.add("127.0.0.1", tempOSCPort);
    this.OscReciever = new OscReciever();
    // this.link = new abletonlink.Audio();
    // this.decode = new DecodeStream();
    // this.decode.on('data', message => { this.distributeMIDIMessage(message) });
    this.on("midi-message", (message) => {
      this.decodeMIDIMessage(message);
    });
    this.reteEngine = new Rete.Engine(name);
    this.reteEngine.on("error", ({ message, data }) => {
      this.alertErrorToRenderer(message, data);
    });
    this.setupMonomeGrid();
    this.monomeGridLed = [];

    reteComponents.map((c) => {
      this.reteEngine.register(c);
    });

    emitterEmitter.on("send-osc-message", (node) => {
      this.emitOSC(node);
    });

    emitterEmitter.on("send-midi-message", (node) => {
      this.emitMIDI(node);
    });
  }

  setupMonomeGrid() {
    monomeGrid().then((grid) => {
      this.monomeGrid = grid;
      this.monomeGrid.key((x, y, s) => {
        this.distributeMonomeGridPress(x, y, s);
      });
      // todo, find grid x and y size
      for (let y = 0; y < 8; y++) {
        this.monomeGridLed[y] = Array.from(new Float32Array(16));
      }
      this.monomeGrid.refresh(this.monomeGridLed);
    });
  }

  processJSON(json) {
    this.reteEngine.process(json);
  }

  process(nodeIds) {
    let data = { id: this.name, nodes: this.nodes };
    nodeIds.forEach((id) => {
      this.reteEngine.process(data, id);
    });
  }

  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }

  alertErrorToRenderer(message, data) {
    this.mainWindow.webContents.send("engine-error", message, data);
  }

  display() {
    console.log(this.nodes);
  }

  storeNodes(nodes) {
    this.nodes = nodes;
  }

  getMIDIInputPorts() {
    // let inputPorts = [['Bridge & Tunnel', 'Bridge & Tunnel']];
    let inputPorts = [];
    for (var i = 0; i < this.midiInput.getPortCount(); i++) {
      const portName = this.midiInput.getPortName(i);
      inputPorts.push([portName, portName]);
    }
    return inputPorts;
  }

  getMIDIOutputPorts() {
    // let outputPorts = [['Bridge & Tunnel', 'Bridge & Tunnel']];
    let outputPorts = [];
    for (var i = 0; i < this.midiOutput.getPortCount(); i++) {
      const portName = this.midiOutput.getPortName(i);
      outputPorts.push([portName, portName]);
    }
    return outputPorts;
  }

  updateMIDIPorts() {
    let midiPorts = {
      midiInputs: this.getMIDIInputPorts(),
      midiOutputs: this.getMIDIOutputPorts(),
    };
    console.log(midiPorts);
    this.mainWindow.webContents.send("midi-device-update", midiPorts);
  }

  decodeMIDIMessage(message) {
    this.decode.write(Buffer.from(message));
  }

  distributeIncomingMIDIMessage(message, portName) {
    console.log("midi message: ", message, portName);
    let channel = message.channel;
    let midiReceivers = Object.values(this.nodes).filter(
      (n) =>
        n.name == "MIDI Receive" &&
        n.data.config.channel.value == channel &&
        n.data.config.portName.value == portName
    );
    midiReceivers.forEach((mr) => {
      mr.data.noteOut = message.note;
      mr.data.velocityOut = message.velocity;
    });
    this.process(midiReceivers.map((mr) => mr.id));
  }

  // distributeOutgoingMIDIMessage(message, portName) {
  //   console.log("midi message: ", message, portName);
  //   let channel = message.channel;
  //   let midiSenders = Object.values(this.nodes).filter(
  //     (n) =>
  //       n.name == "MIDI Send" &&
  //       n.data.config.channel.value == channel &&
  //       n.data.config.portName.value == portName
  //   );
  //   midiSenders.forEach((ms) => {
  //     ms.data.noteOut = message.note;
  //     ms.data.velocityOut = message.velocity;
  //   });
  //   this.process(midiSenders.map((ms) => ms.id));
  // }

  emitMIDI(node) {
    const portName = node.data.config.portName.value;
    const channel = node.data.config.channel.value;
    const note = node.data.noteIn;
    const velocity = node.data.velocityIn;
    console.log(
      "emit midi: ",
      "node.id :",
      node.id,
      " port: ",
      portName,
      "channel: ",
      channel,
      "note: ",
      note,
      "velocity: ",
      velocity
    );
    this.midiOutput.sendMessage([0x90 + channel - 1, note, velocity]);
  }

  emitOSC(node) {
    const address = node.data.config.address.value;
    const args = node.data.oscValues;
    console.log("emit osc: ", node.id, " address: ", address, args);
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

  distributeMonomeGridPress(x, y, state) {
    this.updateMIDIPorts();
    console.log("grid press: ", x, y, state);
    this.monomeGridLed[y][x] = state * 15;
    this.monomeGrid.refresh(this.monomeGridLed);
    let grids = Object.values(this.nodes).filter((n) => n.name == "Grid");
    grids.forEach((mg) => {
      mg.data.x = x;
      mg.data.y = y;
      mg.data.state = state;
    });
    this.process(grids.map((mg) => mg.id));
  }
}

export default Engine;
