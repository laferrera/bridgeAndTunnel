const { DecodeStream } = require("@lachenmayer/midi-messages");
const { MidiMessage } = require("midi-message-parser");
const midi = require("midi");

module.exports = {
  debug: function () {
    console.log("debugging.");
  },
  // init: function (window) {
  // mainWindow = window;
  init: function (engine, portName, portIndex) {
    // Set up a new input.
    this.portName = portName;
    this.input = new midi.Input();
    this.decoder = new DecodeStream();


    if (portName === "Bridge & Tunnel") {
      this.input.openVirtualPort("Bridge & Tunnel");
    } else {
      this.input.openPort(portIndex);
    }

    this.input.on("message", (deltaTime, message) => {
      const parsedMessage = new MidiMessage(message, deltaTime);
      engine.distributeIncomingMIDIMessage(parsedMessage, portName);
    });

    this.decoder.on("data", (message) => {
      engine.distributeIncomingMIDIMessage(message, portName);
    });

    return this;
  },
};
