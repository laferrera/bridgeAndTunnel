const { EncodeStream } = require('@lachenmayer/midi-messages')
const midi = require('midi');

module.exports = {

    init: function (engine, portName) {
        // this.engine = engine;
        this.output = new midi.Output();
        this.encoder = new EncodeStream();
        this.portName = portName;

        if (portName === 'Bridge & Tunnel') {
            this.output.openVirtualPort('Bridge & Tunnel');
        } else {
            this.output.openPort(portName);
        }
        
        this.encoder.on('data', message => {
            console.log('sending message from encoder: ', message)
            this.output.sendMessage(message);
        });

        return this;
    }
}

