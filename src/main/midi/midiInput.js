const midi = require('midi');

module.exports = {
    debug: function () {
        console.log('debugging.');
    },
    // init: function (window) {
        // mainWindow = window;
    init: function (engine, portName) {
        this.engine = engine;


        // Set up a new input.
        const input = new midi.Input();

        if (portName === 'Bridge & Tunnel') {
            input.openVirtualPort('Bridge & Tunnel');
        } else {
            input.openPort(portName);
        }
        console.log('midi started.');

        return input;

    }
}

