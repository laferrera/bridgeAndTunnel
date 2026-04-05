const { SerialPort } = require("serialport");
const EventEmitter = require("events");
// const { Readline } = require("@serialport/parser-readline");

class Crow extends EventEmitter{
  constructor(cb) {
    super();
    this.crowPort = null;
    this.initialized = false;
  }

  initialize = async (cb) => {
    this.fetchModems()
      .then((modem) => {
        this.crowPort = modem;
        if (cb) {
          this.setCallback(cb);
        }
        this.helloWorld();
        this.emit("initialized");
      })
      .catch((err) => this.emit("error", err));
  }

  setCallback = (cb) => {
    this.crowPort.on("data", function (data) {
      if (cb) {
        cb(data.toString());
      }
    });
  };

  fetchModems = async function () {
    const list = await SerialPort.list();
    return new Promise((resolve, reject) => {
      for (const device of list) {
        if (
          device.vendorId === "0483" &&
          device.productId === "5740" &&
          device.manufacturer === "monome & whimsical raps"
        ) {
          console.log("found crow");
          const crowModem = new SerialPort(
            { path: device.path, baudRate: 115200 },
            (err) => {
              if (err) {
                reject(err);
              } else {
                console.log("Connected to Crow");
                resolve(crowModem);
              }
            }
          );
          return;
        }
      }
      reject(new Error("no crow found"));
    });
  };

  sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  writeLines = async function (lines) {
    lines = lines.split("\n");
    for (var i = 0; i < lines.length; i++) {
      this.crowPort.write(lines[i] + "\r\n", "utf8", (err) => {
        if (err) {
          console.log("Error on write: ", err.message);
        }
      });
      await this.sleep(100);
    }
  };

  disconnect = () => {
    if (this.crowPort) this.crowPort.close();
  };

  clear = () => {
    this.writeLines("^^c");
  };

  reset = () => {
    this.writeLines("^^r");
  };

  print = (str) => {
    this.writeLines(`print("${str}")`);
  };

  helloWorld = () => {
    let thorpe =
      "Hugin and Munin fly each day over the spacious earth. I fear for Hugin, that he come not back, yet more anxious am I for Munin";
    this.print(thorpe);
  };

  testFunction = () => {
    let cmd = `input[1].mode('change', 1.0, 0.1, 'rising');
input[1].change = function (state) print('Hello, Molly!') end`;

    this.writeLines(cmd);
  };
}

module.exports = (id, cb) => {
  return new Promise((resolve, reject) => {
    const crow = new Crow();
    crow.on("initialized", () => resolve(crow));
    crow.on("error", reject);
    crow.initialize();
  });
}
