const clampConfig = {
  type: "clampConfig",
  min: {
    value: 0,
    name: "Min",
    type: "number",
    ui: "slider",
    label: "Min",
    min: -1000,
    max: 1000,
    step: 1,
  },
  max: {
    value: 127,
    name: "Max",
    type: "number",
    ui: "slider",
    label: "Max",
    min: -1000,
    max: 1000,
    step: 1,
  },
};

export default clampConfig;
