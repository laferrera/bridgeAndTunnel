const EventEmitter = require("events");

class KissAndTell extends EventEmitter {
  bind(port) {
    console.log("[kiss-and-tell stub] OSC bind skipped (port:", port, ")");
  }

  oscEmit(host, port, address, args) {
    console.log("[kiss-and-tell stub] OSC emit skipped:", host, port, address, args);
  }
}

module.exports = KissAndTell;
