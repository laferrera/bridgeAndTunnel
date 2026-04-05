const { SerialPort } = require("serialport");
const EventEmitter = require("events");
// const { Readline } = require("@serialport/parser-readline");

class Crow extends EventEmitter{
  constructor(cb) {
    super();
    crowPort: null;
    initialized: false;
  }

  initialize = async (cb) => {
    this.fetchModems().then((modem) => {
      // NOTE: It is crucial that we use arrow
      // functions here so that we may preserve
      // the `this` context.
      this.crowPort = modem;
      // this.initialized = true;
      if (cb) {
        this.setCallback(cb);
      }
      this.helloWorld();
      this.emit("initialized");
      // return this;
    });
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
    let crowModem;
    return new Promise((resolve, reject) => {
      // console.log(list);
      list.forEach((device) => {
        if (
          device.vendorId === "0483" &&
          device.productId === "5740" &&
          device.manufacturer === "monome & whimsical raps"
        ) {
          console.log("found crow");
          crowModem = new SerialPort(
            { path: device.path, baudRate: 115200 },
            function (err) {
              if (err) {
                // reject("error connecting to crow!");
                // return console.log("Error: ", err.message);
              } else {
                console.log("Connected to Crow");
                resolve(crowModem);
              }
            }
          );
        } else {
          // reject("no crow!");
        }
      });
      // });
    });
  };

  sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  writeLines = async function (lines) {
    lines = lines.split("\n");
    for (var i = 0; i < lines.length; i++) {
      let utf8Line = Buffer.from(lines[i], "utf8");
      utf8Line += "\r\n";
      this.crowPort.write(utf8Line, function (err) {
        if (err) {
          return console.log("Error on write: ", err.message);
        }
      });
      await this.sleep(100);
    }
  };

  disconnect = () => {
    // TODO, conditionally close?
    this.crowPort.close();
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
    crow.initialize();
    crow.on("initialized", () => {
      //todo something with cb...
      resolve(crow);
    });
  });
}
