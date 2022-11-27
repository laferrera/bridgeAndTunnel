// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import { oscEmitterConfig } from "./oscEmitterConfig.js";
import { midiReceiveConfig } from "./midiRecieveConfig.js";

const uiConfigs = {oscEmitterConfig, midiReceiveConfig};

export { uiConfigs };