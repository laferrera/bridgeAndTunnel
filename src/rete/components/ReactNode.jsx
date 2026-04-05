import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";
import { deepCopy } from "../../globalUtils.js";
import { flashBus } from "../flashBus.js";

export class ReactNode extends Node {

  constructor(props) {
    super(props);
    this.state = { ...this.state, flashing: false };
    this._flashTimeout = null;
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
    this._onFlash = (id) => {
      if (id !== this.props.node.id) return;
      // Restart animation by toggling off then on
      if (this._flashTimeout) clearTimeout(this._flashTimeout);
      this.setState({ flashing: false }, () => {
        this.setState({ flashing: true });
        this._flashTimeout = setTimeout(() => this.setState({ flashing: false }), 200);
      });
    };
    flashBus.on("flash", this._onFlash);
  }

  componentWillUnmount() {
    super.componentWillUnmount && super.componentWillUnmount();
    flashBus.off("flash", this._onFlash);
    if (this._flashTimeout) clearTimeout(this._flashTimeout);
  }

  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected, flashing } = this.state;

    return (
      <div className={`node ${selected}${flashing ? " flashing" : ""}`}>
        <div className="title">{node.name}</div>
        <div className="inputs-outputs-container">
          {/* Inputs */}
          <div className="inputs">
            {inputs.map((input) => (
              <div className="input" key={input.key}>
                <Socket
                  type="input"
                  socket={input.socket}
                  io={input}
                  innerRef={bindSocket}
                />
                {!input.showControl() && (
                  <div className="input-title">{input.name}</div>
                )}
                {input.showControl() && (
                  <Control
                    className="input-control"
                    control={input.control}
                    innerRef={bindControl}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Outputs */}
          <div className="outputs">
            {outputs.map((output) => (
              <div className="output" key={output.key}>
                <div className="output-title">{output.name}</div>
                <Socket
                  type="output"
                  socket={output.socket}
                  io={output}
                  innerRef={bindSocket}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Controls */}
        {controls.map((control) => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}
      </div>
    );
  }
}
