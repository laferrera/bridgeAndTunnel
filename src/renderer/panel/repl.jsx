import React, { useState, useEffect } from "react";
import { ReactReplView } from "awesome-react-repl";

const reverseString = (str) => {
  return str.split("").reverse().join("");
}

const dummyLines = [
        { type: "input", value: "obj = { something: 2 }" },
        { type: "output", value: '{ "something": 2 }' },
        { type: "input", value: "b" },
        { type: "error", value: "TypeError: b is not defined" },
      ]

const clearCode = () => {
  console.log("clearing code");
}

export default function GeneralPurposeReplUI(props) {
  // const [lines, setLines] = useState([{ type: "output", value: 'hello, world' }]);
  const [lines, setLines] = useState(dummyLines);

  const submitCode = (lineValue) => {
    console.log("input was: ", lineValue);
    const inputLine = { type: "input", value: lineValue };
    let outputLine = { type: "output", value: reverseString(lineValue) };
    // setLines([outputLine]);
    setLines([...lines, inputLine, outputLine]);
  };

  return (
    <ReactReplView
      title={`Crow`}
      // tabs={["Javascript", "Python"]}
      // selectedTab="Javascript"
      // onChangeTab={action("onChangeTab")}
      // onSubmit={action("onSubmit")}
      onSubmit={submitCode}
      onClear={clearCode}
      height={200}
      lines={lines}
      // lines={[
      //   { type: "input", value: "obj = { something: 2 }" },
      //   { type: "output", value: '{ "something": 2 }' },
      //   { type: "input", value: "b" },
      //   { type: "error", value: "TypeError: b is not defined" },
      // ]}
    />
  );
}
