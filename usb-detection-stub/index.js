const EventEmitter = require("events");

class UsbDetection extends EventEmitter {
  startMonitoring() {}
  stopMonitoring() {}
}

module.exports = new UsbDetection();
