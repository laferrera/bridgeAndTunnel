import React from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Label from "@radix-ui/react-label";

export default function PanelSlider(props) {

  return (
    <div className="SliderWrapper">
      <Label.Root
        htmlFor={props.setting.label}
        className="Label"
        key={props.setting.label}
      >
        {props.setting.label} : {props.state[props.settingKey].val}
      </Label.Root>
      <Slider.Root
        className="SliderRoot"
        id={props.setting.name}
        defaultValue={[props.state[props.settingKey].val]}
        max={props.setting.max}
        min={props.setting.min}
        step={1}
        aria-label={props.setting.label}
        onValueChange={(value) => {
          console.log(value);
          props.state[props.settingKey].fn(value);
        }}
      >
        <Slider.Track className="SliderTrack">
          <Slider.Range className="SliderRange" />
        </Slider.Track>
        <Slider.Thumb className="SliderThumb" />
      </Slider.Root>
    </div>
  );


}
