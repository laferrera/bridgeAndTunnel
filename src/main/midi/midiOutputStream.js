const { EncodeStream } = require('@lachenmayer/midi-messages')
const midi = require('midi');

module.exports = {

    init: function (engine, portName, portIndex) {
        // this.engine = engine;
        this.portName = portName;
        this.output = new midi.Output();
        this.encoder = new EncodeStream();


        if (portName === 'Bridge & Tunnel') {
            this.output.openVirtualPort('Bridge & Tunnel');
        } else {
            this.output.openPort(portIndex);
        }
        
        this.encoder.on('data', message => {
            console.log('sending message from encoder: ', message)
            this.output.sendMessage(message);
        });

        return this;
    }
}

