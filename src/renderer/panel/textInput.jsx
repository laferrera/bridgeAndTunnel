import React, { children } from "react";
import * as Label from "@radix-ui/react-label";

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
      this.props.state[this.props.settingKey].fn(event.target.value);
  }

  render() {
    return (
      <div className="TextInputWrapper">
        <Label.Root
            htmlFor={this.props.setting.label}
            className="Label"
            key={this.props.setting.label}
        >
          {this.props.setting.label}
        </Label.Root>
        <input className="TextInput" type="text" value={this.props.state[this.props.settingKey].val} onChange={this.handleChange} />
      </div>
    );
  }
}

export default TextInput;