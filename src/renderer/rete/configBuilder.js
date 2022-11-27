// const configBuilder = (config) => {
//   let outputConfig = {type:config.type};
//   Object.keys(config).forEach(key => {
//     outputConfig[key].value = config[key].value;
//     outputConfig[key].name = config[key].name;
//   });
//   return outputConfig
// }

const configBuilder = (config) => {
  let outputConfig = JSON.parse(JSON.stringify(config));
  return outputConfig
}


export { configBuilder };