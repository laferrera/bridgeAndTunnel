const midi = require('midi');

module.exports = {
    debug: function () {
        console.log('debugging.');
    },
    init: function (window) {
        mainWindow = window;

        console.log('midi started.');
        // Set up a new input.
        const input = new midi.Input();

        input.openVirtualPort('Bridge & Tunne');
        // Count the available input ports.
        input.getPortCount();

        // Get the name of a specified input port.
        input.getPortName(0);

        // Configure a callback.
        input.on('message', (deltaTime, message) => {
            // The message is an array of numbers corresponding to the MIDI bytes:
            //   [status, data1, data2]
            // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
            // information interpreting the messages.
            // console.log(`m: ${message} d: ${deltaTime}`);
            mainWindow.webContents.send('midi-message', message);
        });

        // Open the first available input port.
        input.openPort(0);

        // Sysex, timing, and active sensing messages are ignored
        // by default. To enable these message types, pass false for
        // the appropriate type in the function below.
        // Order: (Sysex, Timing, Active Sensing)
        // For example if you want to receive only MIDI Clock beats
        // you should use
        // input.ignoreTypes(true, false, true)
        input.ignoreTypes(false, false, false);

        // ... receive MIDI messages ...

        // Close the port when done.
        // setTimeout(function () {
        //     input.closePort();
        // }, 100000);



    }
}

