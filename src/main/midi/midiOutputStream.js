const { EncodeStream } = require('@lachenmayer/midi-messages')
const midi = require('midi');

module.exports = {
    debug: function () {
        console.log('debugging.');
    },
    init: function (engine, portName) {
        // this.engine = engine;
        this.output = new midi.Output();
        this.encoder = new EncodeStream();

        if (portName === 'Bridge & Tunnel') {
            this.output.openVirtualPort('Bridge & Tunnel');
        } else {
            this.output.openPort(portName);
        }
        
        this.encoder.on('data', message => {
            this.output.sendMessage(message);
        });


        return this;
    }
}

