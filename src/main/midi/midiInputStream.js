const { DecodeStream } = require("@lachenmayer/midi-messages");
const { MidiMessage } = require("midi-message-parser");
const midi = require("midi");

module.exports = {
  debug: function () {
    console.log("debugging.");
  },
  // init: function (window) {
  // mainWindow = window;
  init: function (engine, portName) {
    // Set up a new input.
    this.input = new midi.Input();
    this.decoder = new DecodeStream();

    if (portName === "Bridge & Tunnel") {
      this.input.openVirtualPort("Bridge & Tunnel");
    } else {
      this.input.openPort(portName);
    }

    this.input.on("message", (deltaTime, message) => {
      // engine.emit('midi-message', message);
      // this.decoder.write(Buffer.from(message));
      const parsedMessage = new MidiMessage(message, deltaTime);
      engine.distributeIncomingMIDIMessage(parsedMessage, portName);
    });

    this.decoder.on("data", (message) => {
      engine.distributeIncomingMIDIMessage(message, portName);
    });

    console.log("midi started.");

    return this;
  },
};
