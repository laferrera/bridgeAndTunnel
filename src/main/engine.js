
const mainWindow = require('../main');
const { app, Menu } = require('electron')
const EventEmitter = require("events");
const midiInput = require('./midi/midiInput.js');
const reteEngine = require('./reteEngine.js');
const OscEmitter = require('osc-emitter');
const OscReciever = require('osc-receiver');
const { DecodeStream } = require('@lachenmayer/midi-messages')
const tempOSCPort = 10201;

module.exports = class Engine extends EventEmitter{
  constructor(name) {
    super();
    this.name = name;
    this.nodes = [];
    this.midi = midiInput.init(this);
    this.emitter = new OscEmitter();
    this.emitter.add('127.0.0.1', tempOSCPort);
    this.decode = new DecodeStream();
    this.decode.on('data', message => { this.distributeMIDIMessage(message) });
    this.on('midi-message', (message) => { this.decodeMIDIMessage(message); });
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
    // this.nodes = Object.values(nodes);
    console.log(nodes);
  }

  decodeMIDIMessage(message){
    this.decode.write(Buffer.from(message));
  }

  distributeMIDIMessage(message){
    console.log('midi!', message);
    let channel = message.channel;
    let midis = Object.values(this.nodes).filter(n => (n.name == "MIDI Receive" && n.data.config.channel == channel));
    midis.forEach(midi => {
      midi.outputs.num.connections.forEach(connection => {
        console.log('connection', connection);
        let node = this.nodes[connection.node];
        // let node = this.nodes.find(n => n.id == connection.node);
        // TODO try block... 
        if (node){
          console.log('node', node)
          this.handleMIDIMessage(message, node);
          mainWindow.webContents.send('midi-message', message, node);
        }
        
      });
    });
  }

  handleMIDIMessage(message, node){
    switch(node.name){
      case "MIDI Receive":
        this.distributeMIDIMessage(message, node);
        break;
      case "OSC Emitter":
        this.handleOSCMessage(message, node);
        break;
      default:
    }
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