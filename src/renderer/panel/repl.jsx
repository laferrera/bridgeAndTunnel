import React, { useState, useEffect } from "react";
// import { ReactReplView } from "awesome-react-repl";
import { ReactReplView } from "./ReactReplView.js";

export default function GeneralPurposeReplUI(props) {
  let lines = [...props.state[props.settingKey].val];

  const clearCode = () => {
    props.state[props.settingKey].fn([]);
  };

  const submitCode = (lineValue) => {
    const inputLine = { type: "input", value: lineValue };
    window.electronAPI.sendLinesToCrow(lineValue);
    lines.push(inputLine);
    props.state[props.settingKey].fn(lines);
  };

  return (
    <ReactReplView
      title={`Crow`}
      tabs={[]}
      onSubmit={submitCode}
      onClear={clearCode}
      height={500}
      lines={lines}
    />
  );
}
