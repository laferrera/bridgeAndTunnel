const EventEmitter = require("events");
const OscReceiver = require("osc-receiver");
const OscEmitter = require("osc-emitter");

class KissAndTell extends EventEmitter {
  constructor() {
    super();
    this._receiver = new OscReceiver();
    this._emitter = new OscEmitter();

    // osc-receiver emits ("message", address, arg1, arg2, ...)
    // engine expects ("message", { address, data: [...args] })
    this._receiver.on("message", (address, ...args) => {
      this.emit("message", { address, data: args });
    });

    this._receiver.on("error", (err) => {
      console.error("[kiss-and-tell] OSC receive error:", err);
    });
  }

  bind(port) {
    this._receiver.bind(port);
  }

  // osc-emitter uses add(host, port) then emit(address, ...args)
  // engine calls oscEmit(host, port, address, args)
  oscEmit(host, port, address, args) {
    this._emitter.add(host, port);
    this._emitter.emit(address, ...(args || []));
    this._emitter.remove(host, port);
  }
}

module.exports = KissAndTell;
