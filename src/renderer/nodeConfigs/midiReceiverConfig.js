const midiReceiverConfig = {
    channel: { value: 1, name: "Channel", type: "integer", ui: "select", label: "Channel", options: [["1",1],["2",2], ["3",3],["4",4], ["5",5], ["6",6],["7",7],["8",8],["9",9],["10",10],["11",11],["12",12],["13",13],["14",14],["15",15],["16",16]] },
    portName: { value: 'Bridge & Tunnel', name: "MIDI Input", type: "String", ui: "select", label: "MIDI Input", options: [["None", "none"]] },
    noteOff: { value: true, name: "Note Off", label: "Note Off?", type: "boolean", ui: "switch" },
    checkboxDemoValue: { value: true, name: "Checkbox Demo Value", type: "boolean", ui: "checkbox", label: "Checkbox Demo Value" },
    radioGroupDemoValue: { value: "default", name: "Radio Group Demo Value", type: "string", ui: "radio", label: "Radio Group", options: ["default", "option1", "option2"] }
}  

export { midiReceiverConfig };

