import React, { children } from "react";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@radix-ui/react-icons";

import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";

export default function SelectDemo(select) {
  return (
    <div className="SelectMenuWrapper">
      <Label.Root
        htmlFor="sampleSelectMenu"
        className="Label"
        key={select.setting.label}
      >
        {select.setting.label}
      </Label.Root>
      <Select.Root
        value={select.state[select.settingKey].val}
        onValueChange={select.state[select.settingKey].fn}
        key={select.settingKey}
      >
        <Select.Trigger className="SelectTrigger" id="sampleSelectMenu">
          <Select.Value aria-label={select.value}>
            {select.value}
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
                {select.setting.label}
              </Select.Label>
              {select.setting.options.map((opt) => (
                <Select.Item key={opt} value={opt} className="SelectItem">
                  <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>{opt}</Select.ItemText>
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