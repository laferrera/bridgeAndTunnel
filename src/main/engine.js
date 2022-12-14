const EventEmitter = require("events");
// const midi = require("midi");
const midiInputStream = require("./midi/midiInputStream.js");
const midiOutputStream = require("./midi/midiOutputStream.js");
import { MidiMessage } from "midi-message-parser";
const monomeGrid = require("monome-grid");
const hugAndMun = require("huginn-and-muninn");
const { SerialPort } = require("serialport");
const KissAndTell = require("kiss-and-tell");
const abletonlink = require("abletonlink");
import { emitterEmitter } from "../rete/emitterEmitter.js";
const oscListenPort = 2626;

import Rete from "rete";
import { reteComponents } from "../rete/components/index.js";
class Engine extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.nodes = {};
    this.midiInputStreams = [];
    this.midiInputStreams.push(
      new midiInputStream.init(this, "Bridge & Tunnel")
    );
    this.midiOutputStreams = [];
    this.midiOutputStreams.push(
      new midiOutputStream.init(this, "Bridge & Tunnel")
    );
    this.oscCommunicator = new KissAndTell();
    this.oscCommunicator.bind(oscListenPort);
    this.oscCommunicator.on("message", (message) => { this.handleOSCMessage(message);});

    // this.link = new abletonlink;
    this.reteEngine = new Rete.Engine(name);
    this.reteEngine.on("error", ({ message, data }) => {
      this.alertErrorToRenderer(message, data);
    });
    this.setupMonomeGrid();
    this.monomeGridLeds = [];
    this.monomeGridStates = [];
    this.crow = null;

    reteComponents.map((c) => {
      this.reteEngine.register(c);
    });

    emitterEmitter.on("send-osc-message", (node) => {
      this.emitOSC(node);
    });

    emitterEmitter.on("engine:emit-midi-message", (node) => {
      this.emitMIDI(node);
    });

    // this.on("engine:distribute-midi-message", (message) => {
    //   // this.decodeMIDIMessage(message);
    //   this.distributeIncomingMIDIMessage(message);
    // });
  }

  setupMonomeGrid() {
    monomeGrid().then((grid) => {
      this.monomeGrid = grid;
      this.monomeGrid.key((x, y, s) => {
        this.distributeMonomeGridPress(x, y, s);
      });
      // todo, find grid x and y size
      for (let y = 0; y < 8; y++) {
        this.monomeGridLeds[y] = Array.from(new Float32Array(16));
        this.monomeGridStates[y] = Array.from(new Float32Array(16));
      }
      this.monomeGrid.refresh(this.monomeGridLeds);
    });
  }

  setupCrow() {
    // TODO, do this when USB connect / disconnect...
    if (!this.crow) {
      const callBack = (data) => {
        this.handleCrowOutput(data);
      };
      hugAndMun().then((crow) => {
        this.crow = crow;
        this.crow.setCallback(callBack);
      });
    }
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
    for (let i = 0; i < this.midiInputStreams[0].input.getPortCount(); i++) {
      const portName = this.midiInputStreams[0].input.getPortName(i);
      if (
        this.midiInputStreams.filter((m) => m.portName === portName).length ===
        0
      ) {
        const inPort = new midiInputStream.init(this, portName, i);
        this.midiInputStreams.push(inPort);
        // inputPorts.push([portName, portName]);
      }
    }
    return this.midiInputStreams.map((m) => [m.portName, m.portName]);
  }

  getMIDIOutputPorts() {
    // let outputPorts = [['Bridge & Tunnel', 'Bridge & Tunnel']];
    for (var i = 0; i < this.midiOutputStreams[0].output.getPortCount(); i++) {
      const portName = this.midiOutputStreams[0].output.getPortName(i);
      if (
        this.midiOutputStreams.filter((m) => m.portName === portName).length ===
        0
      ) {
        const outPort = new midiOutputStream.init(this, portName, i);
        this.midiOutputStreams.push(outPort);
        // outputPorts.push([portName, portName]);
      }
    }
    return this.midiOutputStreams.map((m) => [m.portName, m.portName]);
  }

  getMIDIPorts() {
    return {
      midiInputs: this.getMIDIInputPorts(),
      midiOutputs: this.getMIDIOutputPorts(),
    };
  }

  updateMIDIPorts() {
    this.mainWindow.webContents.send("midi-device-update", this.getMIDIPorts());
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
    const message = new MidiMessage(
      "noteon",
      note, // note number
      velocity, // velocity
      channel - 1, // channel
      0 // timestamp
    );

    this.midiOutputStreams
      .filter((m) => m.portName == portName)[0]
      .output.sendMessage(message.toMidiArray());
    // .encoder.noteOn(1, 64, 100);
    // .encoder.write({
    //   type: "NoteOn",
    //   channel: channel,
    //   note: note,
    //   velocity: velocity,
    // });
  }

  emitOSC(node) {
    const host = node.data.config.host.value;
    const port = node.data.config.port.value;
    const address = node.data.config.address.value;
    const args = node.data.oscValues;
    console.log("emit osc: ", host, port, address, args);
    this.oscCommunicator.oscEmit(host, port, address, args);
  }

  handleOSCMessage(message){
    console.log("osc message received: ", message);
    const address = message.address;
    const args = message.data;
    const nodes = Object.values(this.nodes).filter(
      (n) => n.name == "OSC Receiver" && n.data.config.address.value == address
    );
    nodes.forEach((mr) => {
      mr.data.oscValues = [];
      args.forEach((arg) => {
        mr.data.oscValues.push(arg);
      });
    });
    this.process(nodes.map((mr) => mr.id));
  }

  distributeMonomeGridPress(x, y, state) {
    // this.updateMIDIPorts();
    console.log("grid press: ", x, y, state);
    this.monomeGridLeds[y][x] = state * 15;
    this.monomeGridStates[y][x] = state;
    this.monomeGrid.refresh(this.monomeGridLeds);
    let grids = Object.values(this.nodes).filter((n) => n.name == "Grid");
    grids.forEach((mg) => {
      mg.data.x = x;
      mg.data.y = y;
      mg.data.state = state;
    });
    this.process(grids.map((mg) => mg.id));
  }

  sendLinesToCrow(cmd) {
    if (this.crow) {
      console.log("send cmd to crow: ", cmd);
      this.crow.writeLines(cmd);
    } else {
      this.mainWindow.webContents.send("receive-lines-from-crow", "no crow.");
    }
  }

  handleCrowOutput(data) {
    console.log("crow said: ", data);
    this.mainWindow.webContents.send("receive-lines-from-crow", data);
  }

  distributeCrowData(data) {
    let crowNodes = Object.values(this.nodes).filter((n) => n.name == "Crow");
    crowNodes.forEach((c) => {
      c.data.data = data;
    });
    // TODO, how the fuck do we deal with this
    // this.process(crowNodes.map((c) => c.id));
  }
}
        
export default Engine;
              