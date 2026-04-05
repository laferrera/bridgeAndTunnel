const abletonLinkConfig = {
  type: "abletonLinkConfig",
  bpm: {
    value: 120,
    name: "BPM",
    type: "number",
    ui: "slider",
    label: "BPM",
    min: 20,
    max: 300,
    step: 0.5,
  },
  quantum: {
    value: 4,
    name: "Quantum",
    type: "number",
    ui: "select",
    label: "Quantum",
    options: [
      ["1", 1],
      ["2", 2],
      ["4", 4],
      ["8", 8],
    ],
  },
};

export default abletonLinkConfig;
