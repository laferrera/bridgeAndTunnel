const clockConfig = {
  type: "clockConfig",
  bpm: {
    value: 120,
    name: "BPM",
    type: "number",
    ui: "slider",
    label: "BPM",
    min: 1,
    max: 300,
    step: 1,
  },
  subdivision: {
    value: 4,
    name: "Subdivision",
    type: "number",
    ui: "select",
    label: "Subdivision",
    options: [
      ["Whole",      1],
      ["Half",       2],
      ["Quarter",    4],
      ["Eighth",     8],
      ["Sixteenth", 16],
      ["32nd",      32],
    ],
  },
};

export default clockConfig;
