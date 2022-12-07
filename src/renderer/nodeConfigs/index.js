// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import { oscEmitterConfig } from "./oscEmitterConfig.js";
import { midiReceiverConfig } from "./midiReceiverConfig.js";
import { midiEmitterConfig } from "./midiEmitterConfig.js";

const uiConfigs = { oscEmitterConfig, midiReceiverConfig, midiEmitterConfig };

export { uiConfigs };