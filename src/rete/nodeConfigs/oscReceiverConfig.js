let oscReceiverConfig = {
  type: "oscReceiverConfig",
  port: {
    value: "2727",
    name: "Port",
    type: "number",
    ui: "text",
    label: "Port",
  },
  address: {
    value: "/note_on",
    name: "Address",
    type: "string",
    ui: "text",
    label: "Address",
  },
  oscValues: {
    value: [],
  },
  numOutputs: 1,
  addOutput: {
    name: "Add Output",
    type: "button",
    ui: "button",
    label: "Add Output",
    rendererEmitterCall: "addOutput",
  },
  removeOutput: {
    name: "Remove Output",
    type: "button",
    ui: "button",
    label: "Remove Output",
    rendererEmitterCall: "removeOutput",
  },
};
export default oscReceiverConfig;
