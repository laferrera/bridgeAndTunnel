let oscEmitterConfig = {
  address: { value: "/note_on", name: "Address", type: "string", ui: "text", label: "Address" },
  addInput: { name: "Add Input", type: "button", ui: "button", label: "Add Input", emitterCall:"addInput" },
  removeInput: { name: "Remove Input", type: "button", ui: "button", label: "Remove Input", emitterCall: "removeInput" },
}
export { oscEmitterConfig };
