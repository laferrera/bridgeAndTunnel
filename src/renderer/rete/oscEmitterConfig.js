import Rete from "rete";
let oscEmitterConfig = {
  channel: { value: 1, type: "number", name: "Channel" },
  selectDemoValue: { value: "Germany", type: "string", name: "Select Demo Value" },
  switchDemoValue: { value: true, type: "boolean", name: "Switch Demo Value" },
  checkboxDemoValue: { value: true, type: "boolean", name: "Checkbox Demo Value" },
  radioGroupDemoValue: { value: "default", type: "string", name: "Radio Group Demo Value" }
}
export { oscEmitterConfig };
