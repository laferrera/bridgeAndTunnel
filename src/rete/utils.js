const configBuilder = (config) => {
  let outputConfig = {};
  Object.keys(config).forEach(key => {
      outputConfig[key] = {};
      outputConfig[key].value = config[key].value;
      outputConfig[key].name = config[key].name;
  });
  return outputConfig
}

const inputsHaveChanged = (inputs, data) => {
  let changed = false;
  Object.keys(inputs).forEach(key => {
    // console.log("inputs[key][0]",inputs[key][0]);
    // console.log("data[key]", data[key]);
    if (inputs[key].length && inputs[key][0] !== data[key]) {
      changed = true;
      data[key] = inputs[key][0];
    }
  });
  return changed;
}

export { configBuilder, inputsHaveChanged };