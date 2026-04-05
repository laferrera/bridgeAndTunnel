const EventEmitter = require("events");
const flashBus = new EventEmitter();
flashBus.setMaxListeners(200);
export { flashBus };
