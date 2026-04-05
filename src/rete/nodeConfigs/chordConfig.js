const chordConfig = {
  type: "chordConfig",
  chordType: {
    value: "major",
    name: "Chord Type",
    type: "string",
    ui: "select",
    label: "Chord Type",
    options: [
      ["Major",        "major"],
      ["Minor",        "minor"],
      ["Dom 7th",      "dom7"],
      ["Major 7th",    "maj7"],
      ["Minor 7th",    "min7"],
      ["Diminished",   "dim"],
      ["Augmented",    "aug"],
      ["Sus2",         "sus2"],
      ["Sus4",         "sus4"],
      ["Dim 7th",      "dim7"],
    ],
  },
};

export default chordConfig;
