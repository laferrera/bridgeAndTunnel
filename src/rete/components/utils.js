import Rete from "rete";
import { deepCopy } from "../../globalUtils";

const configBuilder = (node, config) => {
  if (!node.data.config) {
    node.data.config = deepCopy(config);
  }
};

// const configBuilder = (config) => {
//   let outputConfig = {};
//   Object.keys(config).forEach((key) => {
//     outputConfig[key] = {};
//     outputConfig[key].value = config[key].value;
//     outputConfig[key].name = config[key].name;
//   });
//   return outputConfig;
// };

const checkInputsAndSetData = (inputs, data) => {
  let changed = false;
  Object.keys(inputs).forEach((key) => {
    if (inputs[key].length && inputs[key][0] !== data[key]) {
      changed = true;
      data[key] = inputs[key][0] ? inputs[key][0] : 0;
    }
  });
  return changed;
};

const multiInputs = (numInputs, node, socket) => {
  [...Array(numInputs)].forEach((_, i) => {
    let inp = new Rete.Input(`num${i + 1}`, "Number", socket);
    node.addInput(inp);
  });
};

const multiOutputs = (numOutputs, node, socket) => {
  [...Array(numOutputs)].forEach((_, i) => {
    let out = new Rete.Output(`num${i + 1}`, "Number", socket);
    node.addOutput(out);
  });
};

export { configBuilder, checkInputsAndSetData, multiInputs, multiOutputs };
