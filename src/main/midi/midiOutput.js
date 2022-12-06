const midi = require('midi');

module.exports = {
    debug: function () {
        console.log('debugging.');
    },
    // init: function (window) {
        // mainWindow = window;
    init: function (engine) {
        this.engine = engine;


        // Set up a new input.
        const output = new midi.Output();
        console.log('midi started.');
        console.log('number of midi outputs: ', output.getPortCount());
        for (var i = 0; i < output.getPortCount(); i++){
            console.log('midi output: ', output.getPortName(i));
        }
        return output;
    }
}

