// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import { oscEmitterConfig } from "./oscEmitterConfig.js";
import { midiReceiverConfig } from "./midiReceiverConfig.js";
import { midiEmitterConfig } from "./midiEmitterConfig.js";
import { mathConfig } from "./mathConfig.js";
import { quantizerConfig } from "./quantizerConfig.js";

const uiConfigs = {
  oscEmitterConfig,
  midiReceiverConfig,
  midiEmitterConfig,
  mathConfig,
  quantizerConfig,
};

export { uiConfigs };
