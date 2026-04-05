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
import monomeCrowConfig from "./monomeCrowConfig.js";
import monomeGridConfig from "./monomeGridConfig.js";
import minConfig from "./minConfig.js";
import chordConfig from "./chordConfig.js";
import randomConfig from "./randomConfig.js";
import abletonLinkConfig from "./abletonLinkConfig.js";

const uiConfigs = {
  oscEmitterConfig,
  oscReceiverConfig,
  midiReceiverConfig,
  midiEmitterConfig,
  mathConfig,
  quantizerConfig,
  monomeCrowConfig,
  monomeGridConfig,
  minConfig,
  chordConfig,
  randomConfig,
  abletonLinkConfig,
};

export { uiConfigs };
