let oscEmitterConfig = {
  host: {
    value: "localhost",
    name: "Host",
    type: "string",
    ui: "text",
    label: "Host",
  },  
  port:{
    value: "7272",
    name: "Port",
    type: "number",
    ui: "text",
    label: "Port"
  },
  address: {
    value: "/note_on",
    name: "Address",
    type: "string",
    ui: "text",
    label: "Address",
  },
  addInput: {
    name: "Add Input",
    type: "button",
    ui: "button",
    label: "Add Input",
    rendererEmitterCall: "addInput",
  },
  removeInput: {
    name: "Remove Input",
    type: "button",
    ui: "button",
    label: "Remove Input",
    rendererEmitterCall: "removeInput",
  },
};
export default oscEmitterConfig;
