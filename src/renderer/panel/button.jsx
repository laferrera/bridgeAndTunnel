import React, { children } from "react";
class Button extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.emitter.emit(this.props.setting.emitterCall, this.props.node);
  }

  render() {
    return (
      <button className="Button" onClick={this.handleClick}>
        {this.props.setting.name}
      </button>
    );
  }
}

export default Button;