import React, { useState, useEffect } from "react";

import "./peStyles.css";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@radix-ui/react-icons";

import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as HoverCard from "@radix-ui/react-hover-card";

const countriesArray = [
  "France",
  "United Kingdom",
  "Spain",
  "Hungary",
  "Netherlands",
  "Italy",
  "Germany",
  "Japan",
  "Denmark"
];

const fruitsArray = ["Apple", "Orange", "Lemon", "Melon"];

export default function PanelExperiment(node) {
  let nodeConfig = node.node.data.config;
  console.log("panel experiment NODE selectDemoValue", node.node.id, nodeConfig.selectDemoValue.value);
  const [selectDemoValue, setSelectDemoValue] = useState(nodeConfig.selectDemoValue.value);
  const [switchDemoValue, setSwitchDemoValue] = useState(nodeConfig.switchDemoValue.value);
  const [checkboxDemoValue, setCheckboxDemoValue] = useState(nodeConfig.checkboxDemoValue.value);
  const [radioGroupDemoValue, setRadioGroupDemoValue] = useState(nodeConfig.radioGroupDemoValue.value);
  // const stateVars = [selectDemoValue, switchDemoValue, checkboxDemoValue, radioGroupDemoValue];
  const stateVars = { selectDemoValue: selectDemoValue, switchDemoValue: switchDemoValue, checkboxDemoValue: checkboxDemoValue, radioGroupDemoValue: radioGroupDemoValue };
  const didMount = React.useRef(false);

  console.log('panel experiment USESTATE selectDemoValue', selectDemoValue);

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    Object.keys(stateVars).forEach((key, index) => {
      if (stateVars[key] !== node.node.data.config[key].value) {
        console.log("setting stateVars[key]", stateVars[key]);
        nodeConfig[key].value = stateVars[key]
      }
    });
    return () => {
      didMount.current = false;
    }
  }, [Object.keys(stateVars)]);




  return (
    <div>
      <div className="Sidebar">
        <h1 className="SidebarH1">Sidebar</h1>

        <div className="SelectMenuWrapper">
          <Label.Root
            htmlFor="sampleSelectMenu"
            className="Label"
            id="sampleSelectMenuLabel"
          >
            Select menu title
          </Label.Root>
          <Select.Root
            value={selectDemoValue}
            onValueChange={setSelectDemoValue}
          >
            <Select.Trigger className="SelectTrigger" id="sampleSelectMenu">
              <Select.Value aria-label={selectDemoValue}>
                {selectDemoValue}
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
                  <Select.Label className="SelectLabel">nodeConfig.selectDemoValue.label</Select.Label>
                  {nodeConfig.selectDemoValue.options.map((address) => (
                    <Select.Item key={address} value={address} className="SelectItem">
                      <Select.ItemIndicator className="SelectItemIndicator">
                        <CheckIcon />
                      </Select.ItemIndicator>
                      <Select.ItemText>{address}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>

                <Select.Separator className="SelectSeparator" />

                {/* <Select.Group>
                  <Select.Label className="SelectLabel">Fruits</Select.Label>
                  {fruitsArray.map((address) => (
                    <Select.Item key={address} value={address} className="SelectItem">
                      <Select.ItemIndicator className="SelectItemIndicator">
                        <CheckIcon />
                      </Select.ItemIndicator>
                      <Select.ItemText>{address}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group> */}
              </Select.Viewport>
              <Select.ScrollDownButton className="SelectScrollButtonStyles">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Root>
        </div>

        <hr className="SidebarSeparator" />

        <Label.Root htmlFor="AirplaneModeSwitch" className="Label">
          Switch title
        </Label.Root>

        <HoverCard.Root className="HoverCard" openDelay="1000">
          <HoverCard.Trigger>
            <div className="SwitchWrapper" id="AirplaneModeSwitch">
              <Switch.Root
                className="Switch"
                id="sampleSwitch"
                onCheckedChange={setSwitchDemoValue}
                checked={switchDemoValue}
              >
                <Switch.Thumb className="SwitchThumb" />
              </Switch.Root>
              <Label.Root htmlFor="sampleSwitch" className="LabelInline">
                Airplane mode
              </Label.Root>
            </div>
          </HoverCard.Trigger>
          <HoverCard.Content
            className="HoverCardContent"
            sideOffset={5}
            alignOffset={8}
            side="bottom"
            align="start"
          >
            <div className="HoverCardImage" />
            <span className="HoverCardText">
              Not sure if this is an appropiate use of this component. Probably
              better for expanding user info on avatar hover.
            </span>
          </HoverCard.Content>
        </HoverCard.Root>

        <hr className="SidebarSeparator" />

        <div className="CheckboxWrapper">
          <Checkbox.Root
            className="Checkbox"
            id="sampleCheckbox"
            checked={checkboxDemoValue}
            onCheckedChange={setCheckboxDemoValue}
          >
            <Checkbox.Indicator className="CheckboxIndicator">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <Label.Root className="LabelInline" htmlFor="sampleCheckbox">
            Accept terms and conditions.
          </Label.Root>
        </div>

        <hr className="SidebarSeparator" />
        <form>
          <RadioGroup.Root
            defaultValue="default"
            aria-label="View density"
            className="RadioGroup"
            value={radioGroupDemoValue}
            onValueChange={setRadioGroupDemoValue}
          >
            <div className="RadioGroupItemWrapper">
              <RadioGroup.Item
                value="default"
                id="r1"
                className="RadioGroupItem"
              >
                <RadioGroup.Indicator className="RadioGroupIndicator" />
              </RadioGroup.Item>
              <Label.Root htmlFor="r1" className="RadioLabel">
                Default
              </Label.Root>
            </div>
            <div className="RadioGroupItemWrapper">
              <RadioGroup.Item
                value="comfortable"
                id="r2"
                className="RadioGroupItem"
              >
                <RadioGroup.Indicator className="RadioGroupIndicator" />

              </RadioGroup.Item>
              <Label.Root htmlFor="r2" className="RadioLabel">
                Comfortable
              </Label.Root>
            </div>
            <div className="RadioGroupItemWrapper">
              <RadioGroup.Item
                value="compact"
                id="r3"
                className="RadioGroupItem"
              >
                <RadioGroup.Indicator className="RadioGroupIndicator" />

              </RadioGroup.Item>
              <Label.Root htmlFor="r3" className="RadioLabel">
                Compact
              </Label.Root>
            </div>
          </RadioGroup.Root>
        </form>

        <hr className="SidebarSeparator" />
      </div>
      <div className="StateMonitor">
        <span className="Label Caption">Select menu value:</span>
        <span className="Label">{selectDemoValue}</span>
        <span className="Label Caption">Switch value:</span>
        <span className="Label">{switchDemoValue === true ? "ON" : "OFF"}</span>
        <span className="Label Caption">Checkbox value:</span>
        <span className="Label">
          {checkboxDemoValue === true ? "ON" : "OFF"}
        </span>
        <span className="Label Caption">Radio group value:</span>
        <span className="Label">{radioGroupDemoValue}</span>
      </div>
    </div>
    
  );
}
