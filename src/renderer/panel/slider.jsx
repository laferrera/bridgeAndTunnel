import React, { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Label from "@radix-ui/react-label";

export default function PanelSlider(props) {
  const committedValue = props.state[props.settingKey].val;
  const [sliderValue, setSliderValue] = useState(committedValue);
  const [inputText, setInputText] = useState(String(committedValue));

  useEffect(() => {
    setSliderValue(committedValue);
    setInputText(String(committedValue));
  }, [committedValue]);

  const commit = (num) => {
    const clamped = Math.max(props.setting.min, Math.min(props.setting.max, num));
    setSliderValue(clamped);
    setInputText(String(clamped));
    props.state[props.settingKey].fn(clamped);
  };

  const handleInputCommit = () => {
    const parsed = Number(inputText);
    if (!isNaN(parsed)) {
      commit(parsed);
    } else {
      setInputText(String(sliderValue));
    }
  };

  return (
    <div className="SliderWrapper">
      <Label.Root
        htmlFor={props.setting.label}
        className="Label"
        key={props.setting.label}
      >
        {props.setting.label}
      </Label.Root>
      <div className="SliderRow">
        <Slider.Root
          className="SliderRoot"
          id={props.setting.name}
          value={[sliderValue]}
          max={props.setting.max}
          min={props.setting.min}
          step={1}
          aria-label={props.setting.label}
          onValueChange={(value) => {
            setSliderValue(value[0]);
            setInputText(String(value[0]));
          }}
          onValueCommit={(value) => {
            commit(value[0]);
          }}
        >
          <Slider.Track className="SliderTrack">
            <Slider.Range className="SliderRange" />
          </Slider.Track>
          <Slider.Thumb className="SliderThumb" />
        </Slider.Root>
        <input
          className="SliderTextInput"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onBlur={handleInputCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleInputCommit();
          }}
        />
      </div>
    </div>
  );
}
