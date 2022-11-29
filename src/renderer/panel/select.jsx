import React, { children } from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@radix-ui/react-icons";

import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";

export default function SelectDemo(props) {
  return (
    <div className="SelectMenuWrapper">
      <Label.Root
        htmlFor="sampleSelectMenu"
        className="Label"
        key={props.setting.label}
      >
        {props.setting.label}
      </Label.Root>
      <Select.Root
        value={props.state[props.settingKey].val}
        onValueChange={props.state[props.settingKey].fn}
        key={props.settingKey}
      >
        <Select.Trigger className="SelectTrigger" id="sampleSelectMenu">
          <Select.Value aria-label={props.value}>
            {props.value}
          </Select.Value>
          <Select.Icon>
            <ChevronDownIcon className="ChevronIcon" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButtonStyles">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            <Select.Group>
              <Select.Label className="SelectLabel">
                {props.setting.label}
              </Select.Label>
              {props.setting.options.map((opt) => (
                <Select.Item key={opt} value={opt[1]} className="SelectItem">
                  <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>{opt[0]}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>

            {/* <Select.Separator className="SelectSeparator" /> */}
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButtonStyles">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
    </div>
  )
}