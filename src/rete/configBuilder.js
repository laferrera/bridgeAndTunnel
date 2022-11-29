const configBuilder = (config) => {
  let outputConfig = {};
  Object.keys(config).forEach(key => {
      outputConfig[key] = {};
      outputConfig[key].value = config[key].value;
      outputConfig[key].name = config[key].name;
  });
  return outputConfig
}


export { configBuilder };