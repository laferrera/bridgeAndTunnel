'use strict';
const EventEmitter = require("events");
const midi = require('./midi/midi.js');
const OscEmitter = require('osc-emitter');
const { DecodeStream } = require('@lachenmayer/midi-messages')
const tempOSCPort = 10201;

module.exports = class Engine extends EventEmitter{
  constructor(name) {
    super();
    this.name = name;
    this.nodes = [];
    this.midi = midi.init(this);
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
    console.log(node);
  }

  updateNode(node){
    console.log(node);
    // this.nodes.find(n => n.id == node.id).controls.get('preview').setValue(node.data.num);
  }

  removeNode(node){
    this.nodes.splice(this.nodes.indexOf(node), 1);
  }

  initialzeNodes(nodes){
    // this.nodes = nodes;
    this.nodes = Object.values(nodes);
    console.log(nodes);
  }

  decodeMIDIMessage(message){
    this.decode.write(Buffer.from(message));
  }

  distributeMIDIMessage(message){
    let channel = message.channel;
    let midis = this.nodes.filter(n => (n.name == "MIDI" && n.data.num == channel));
    midis.forEach(midi => {
      let node_id = Object.values(midi.outputs.num.connections)[0].node;
      Object.values(midi.outputs.num.connections).forEach(connection => {
        let node = this.nodes.find(n => n.id == connection.node);
        // TODO try block... 
        if (node) this.handleMIDIMessage(message, node);
        
      });
    });
  }

  handleMIDIMessage(message, node){
    switch(node.name){
      case "MIDI":
        this.distributeMIDIMessage(message, node);
        break;
      case "OSC":
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