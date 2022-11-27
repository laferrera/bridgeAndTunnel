let oscEmitterConfig = {
  channel: { value: 1, name: "Channel", type: "integer", ui: "select", label: "Channel", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  selectDemoValue: { value: "Germany", name: "Countries", type: "String", ui: "select", label: "Select Country", options: ["Germany", "USA", "France", "Spain"] },
  switchDemoValue: { value: true, name: "Switch Demo Value", type: "boolean", ui: "switch", label: "Switch Demo Value" },
  checkboxDemoValue: { value: true, name: "Checkbox Demo Value", type: "boolean", ui: "checkbox", label: "Checkbox Demo Value" },
  radioGroupDemoValue: { value: "default", name: "Radio Group Demo Value", type: "string", ui: "radio", label: "Radio Group", options: ["default", "option1", "option2"] }
}
export { oscEmitterConfig };
