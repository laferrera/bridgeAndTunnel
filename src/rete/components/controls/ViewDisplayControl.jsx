import Rete from "rete";
import React from "react";
import { viewUpdateBus } from "../../viewUpdateBus.js";

class ViewDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.initialValue ?? 0 };
  }

  componentDidMount() {
    this._handler = ({ nodeId, value }) => {
      if (nodeId === this.props.nodeId) {
        this.setState({ value: value ?? 0 });
      }
    };
    viewUpdateBus.on("update", this._handler);
  }

  componentWillUnmount() {
    viewUpdateBus.off("update", this._handler);
  }

  render() {
    return (
      <input
        type="number"
        value={this.state.value}
        readOnly
        onPointerDown={(e) => e.stopPropagation()}
        onChange={() => {}}
        style={{ pointerEvents: "none" }}
      />
    );
  }
}

export class ViewDisplayControl extends Rete.Control {
  constructor(key, node) {
    super(key);
    this.component = ViewDisplay;
    this.props = {
      nodeId: node.id,
      initialValue: node.data[key] ?? 0,
    };
  }
}
