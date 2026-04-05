import Rete from "rete";
import React from "react";

export class ButtonControl extends Rete.Control {
  static component = ({ label, onTrigger }) => (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onTrigger}
      style={{ width: "100%", cursor: "pointer" }}
    >
      {label}
    </button>
  );

  constructor(emitter, key, node, label = "Trigger") {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ButtonControl.component;

    node.data[key] = false;
    this.props = {
      label,
      onTrigger: () => {
        node.data[key] = true;
        this.emitter.trigger("process");
      },
    };
  }
}
