// https://stackblitz.com/edit/react-m2l1cn?file=src%2FApp.js,src%2Fcomponents%2FNotes.js
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

export class Panel extends React.Component {
  constructor(props) {
    super(props);
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
    this.state = {
      selectDemoValue: "France",
      switchDemoValue: false,
      checkboxDemoValue: false,
      radioGroupDemoValue: "Apple"
    };
  }

    

  render() {
    return (
      <div className="App">
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
                  {countriesArray[selectDemoValue]}
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
                    <Select.Label className="SelectLabel">Countries</Select.Label>
                    {countriesArray.map((address) => (
                      <Select.Item key={address} value={address} className="SelectItem">
                        <Select.ItemIndicator className="SelectItemIndicator">
                          <CheckIcon />
                        </Select.ItemIndicator>
                        <Select.ItemText>{address}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>

                  <Select.Separator className="SelectSeparator" />

                  <Select.Group>
                    <Select.Label className="SelectLabel">Fruits</Select.Label>
                    {fruitsArray.map((address) => (
                      <Select.Item key={address} value={address} className="SelectItem">
                        <Select.ItemIndicator className="SelectItemIndicator">
                          <CheckIcon />
                        </Select.ItemIndicator>
                        <Select.ItemText>{address}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
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
                  <img
                    src="https://source.unsplash.com/featured/?default"
                    alt="default"
                    className="RadioGroupItemImageCover"
                  />
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
                  <img
                    src="https://source.unsplash.com/featured/?comfortable"
                    alt="default"
                    className="RadioGroupItemImageCover"
                  />
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
                  <img
                    src="https://source.unsplash.com/featured/?compact"
                    alt="default"
                    className="RadioGroupItemImageCover"
                  />
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
}