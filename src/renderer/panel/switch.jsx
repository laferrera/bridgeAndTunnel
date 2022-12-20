import React from "react";
import * as Switch from "@radix-ui/react-switch";
import * as Label from "@radix-ui/react-label";

export default function PanelSwitch(props) {
  return (
    <div
      className="SwitchWrapper"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Label.Root
        htmlFor={props.setting.label}
        className="Label"
        key={props.setting.label}
      >
        {props.setting.label}
      </Label.Root>
      <Switch.Root
        className="SwitchRoot"
        id={props.setting.name}
        checked={props.state[props.settingKey].val}
        onCheckedChange={(checked) => {
          console.log(checked);
          props.state[props.settingKey].fn(checked);
        }}
      >
        <Switch.Thumb className="SwitchThumb" />
      </Switch.Root>
    </div>
  );
}