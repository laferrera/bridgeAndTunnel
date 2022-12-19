import React, { useState, useEffect } from "react";
import "./panelStyles.css";
import PanelSelect from "./select.jsx";
import PanelPiano from "./piano.jsx";
import GeneralPurposeReplUI from "./repl.jsx";
import Button from "./button.jsx";
// import { uiConfigs } from '../nodeConfigs';
import DataChangeAction from "../../rete/plugins/data-change-action.js";

import * as Label from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as HoverCard from "@radix-ui/react-hover-card";

export default function Panel(props) {
  let nodeConfig = props.node.data.config;
  const uiConfig = props.node.data.config;

  const state = {};
  const components = [];
  const didMount = React.useRef(null);
  for (const setting of Object.keys(nodeConfig)) {
    const resultArr = useState(nodeConfig[setting].value);
    state[setting] = {
      val: resultArr[0],
      fn: resultArr[1],
    };

    if (uiConfig.hasOwnProperty(setting)){
    const ui = uiConfig[setting].ui;
    switch (ui){
      case "select":
      components.push(
        <PanelSelect
          key={setting}
          state={state}
          settingKey={setting}
          setting={uiConfig[setting]}
        />);
        break;
      case "button":
        components.push(
          <Button
            key={setting}
            rendererEmitter={props.rendererEmitter}
            node={props.node}
            setting={uiConfig[setting]}
          />);
        break;
      case "piano":
        components.push(
          <PanelPiano
            key={setting}
            state={state}
            settingKey={setting}
            setting={uiConfig[setting]}
          />
        );
        break;
      case "repl":
        components.push(
          <GeneralPurposeReplUI
            key={setting}
            state={state}
            settingKey={setting}
            setting={uiConfig[setting]}
          />
        );
        break;
      default:
        console.log("no ui for: ", ui)
    }
    }
  }

  useEffect(() => {
    // if (!didMount.current) {
    //   console.log("mounting?");
    //   didMount.current = true;
    //   return;
    // }
    let alertEngine = false;
    const prevConfig = JSON.parse(JSON.stringify(nodeConfig));
    Object.keys(state).forEach((key, index) => {
      if (state[key].val !== props.node.data.config[key].value) {
        nodeConfig[key].value = state[key].val;
        window.electronAPI.sendNodesToMain(props.editor.toJSON().nodes);
        props.editor.trigger(
          "addhistory",
          new DataChangeAction(prevConfig, nodeConfig, props.node)
        );
      }
    });
    return () => {
      didMount.current = false;
    };
  }, [state, nodeConfig]);

  return (
    <div className="Sidebar">
      <h2 className="SidebarH2">{props.node.name}</h2>
      {components}
    </div>
  );
}
