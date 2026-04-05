const xypadConfig = {
  type: "xypadConfig",
  x: {
    value: 0.5,
    ui: "xypad",
    label: "XY",
  },
  y: {
    value: 0.5,
    // no ui — rendered inside xypad component
  },
  xMin: {
    value: 0,
    ui: "slider",
    label: "X Min",
    min: -1000,
    max: 1000,
  },
  xMax: {
    value: 127,
    ui: "slider",
    label: "X Max",
    min: -1000,
    max: 1000,
  },
  yMin: {
    value: 0,
    ui: "slider",
    label: "Y Min",
    min: -1000,
    max: 1000,
  },
  yMax: {
    value: 127,
    ui: "slider",
    label: "Y Max",
    min: -1000,
    max: 1000,
  },
};

export default xypadConfig;
