// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import oscEmitterConfig from "./oscEmitterConfig.js";
import oscReceiverConfig from "./oscReceiverConfig.js";
import midiReceiverConfig from "./midiReceiverConfig.js";
import midiEmitterConfig from "./midiEmitterConfig.js";
import mathConfig from "./mathConfig.js";
import quantizerConfig from "./quantizerConfig.js";
import monomCrowConfig from "./monomCrowConfig.js";

const uiConfigs = {
  oscEmitterConfig,
  oscReceiverConfig,
  midiReceiverConfig,
  midiEmitterConfig,
  mathConfig,
  quantizerConfig,
  monomCrowConfig,
};

export { uiConfigs };
