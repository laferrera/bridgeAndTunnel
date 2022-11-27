import React, { useState, useEffect } from "react";
import "./peStyles.css";
import SelectDemo from "./select.jsx";
import { uiConfigs} from '../nodeConfigs';

import * as Label from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as HoverCard from "@radix-ui/react-hover-card";

export default function Panel(node) {
  let nodeConfig = node.node.data.config;
  const uiConfig = uiConfigs[node.node.data.configType];
  const state = {};
  const components = [];
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
    }

  }
  const didMount = React.useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    Object.keys(state).forEach((key, index) => {
      if (state[key].val !== node.node.data.config[key].value) {
        nodeConfig[key].value = state[key].val;
      }
    });
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
