const monomeCrowConfig = {
  type: "monomeCrowConfig",
  repl: {
    value: [
      {
        type: "output",
        value: "Hugin and Munin fly each day over the spacious earth.",
      },
    ],
    name: "repl",
    type: "repl",
    ui: "repl",
    label: "repl",
  },
  numInputs: 1,
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

export default monomeCrowConfig;
