import React, { useState, useEffect } from "react";
import "./peStyles.css";
import SelectDemo from "./select.jsx";
import Button from "./button.jsx";
import { uiConfigs } from '../nodeConfigs';

import * as Label from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as HoverCard from "@radix-ui/react-hover-card";

export default function Panel(props) {
  let nodeConfig = props.node.data.config;
  const uiConfig = uiConfigs[props.node.data.configType];
  const state = {};
  const components = [];
  const didMount = React.useRef(false);
  for (const setting of Object.keys(nodeConfig)) {
    const resultArr = useState(nodeConfig[setting].value);
    state[setting] = {
      val: resultArr[0],
      fn: resultArr[1]
    };
    if (uiConfig.hasOwnProperty(setting)){
      if (uiConfig[setting].ui === "select") {
        components.push(<SelectDemo key={setting} state={state} settingKey={setting} setting={uiConfig[setting]} />);
      }
      if(uiConfig[setting].ui === "button"){
        components.push(<Button key={setting} emitter={props.emitter} node={props.node} setting={uiConfig[setting]}/>);
      }
    }
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    let alertEngine = false;
    Object.keys(state).forEach((key, index) => {
      if (state[key].val !== props.node.data.config[key].value) {
        alertEngine = true;
        nodeConfig[key].value = state[key].val;
      }
    });
    if (alertEngine) {
      props.emitter.emit("updateEngine");
    }
    return () => {
      didMount.current = false;
    }
  }, [state]);    


  





  return (
    <div>
      <div className="Sidebar">
        <h1 className="SidebarH1">Sidebar</h1>
        {components}
      </div>
    </div>
  );
}
