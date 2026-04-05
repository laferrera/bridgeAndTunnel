import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";
import { deepCopy } from "../../globalUtils.js";
import { flashBus } from "../flashBus.js";

export class ReactNode extends Node {

  constructor(props) {
    super(props);
    this._nodeRef = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
    this._onFlash = (id) => {
      if (id !== this.props.node.id) return;
      const el = this._nodeRef.current;
      if (!el) return;
      el.classList.remove("flashing");
      void el.offsetWidth; // force reflow to restart animation
      el.classList.add("flashing");
    };
    flashBus.on("flash", this._onFlash);
  }

  componentWillUnmount() {
    super.componentWillUnmount && super.componentWillUnmount();
    flashBus.off("flash", this._onFlash);
  }

  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div ref={this._nodeRef} className={`node ${selected}`}>
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
