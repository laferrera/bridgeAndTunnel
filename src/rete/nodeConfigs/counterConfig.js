const counterConfig = {
  type: "counterConfig",
  max: {
    value: 8,
    name: "Max",
    type: "number",
    ui: "slider",
    label: "Max",
    min: 1,
    max: 64,
    step: 1,
  },
  step: {
    value: 1,
    name: "Step",
    type: "number",
    ui: "slider",
    label: "Step",
    min: 1,
    max: 16,
    step: 1,
  },
};

export default counterConfig;
