import React, { children } from "react";
class Button extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.rendererEmitter.emit(
      this.props.setting.rendererEmitterCall,
      this.props.node
    );
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