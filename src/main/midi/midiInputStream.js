const { MidiMessage } = require("midi-message-parser");
const midi = require("@julusian/midi");

module.exports = {
  init: function (engine, portName, portIndex) {
    this.portName = portName;
    this.input = new midi.Input();

    if (portName === "Bridge & Tunnel") {
      this.input.openVirtualPort("Bridge & Tunnel");
    } else {
      this.input.openPort(portIndex);
    }

    this.input.on("message", (deltaTime, message) => {
      const parsedMessage = new MidiMessage(message, deltaTime);
      engine.distributeIncomingMIDIMessage(parsedMessage, portName);
    });

    return this;
  },
};
