// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import { AddComponent } from "./AddComponent.jsx";
import { MultiplyComponent } from "./MultiplyComponent.jsx";
import { MinComponent } from "./MinComponent.jsx";
import { ConstantComponent } from "./ConstantComponent.jsx";
import { QuantizerComponent } from "./QuantizerComponent.jsx";
import { MIDIReceiverComponent } from "./MIDIReceiverComponent.jsx";
import { MIDIEmitterComponent } from "./MIDIEmitterComponent.jsx";
import { OSCEmitterComponent } from "./OSCEmitterComponent.jsx";
import { OSCReceiverComponent } from "./OSCReceiverComponent.jsx";
import { MonomeGridComponent } from "./MonomeGridComponent.jsx";
import { MonomeCrowComponent } from "./MonomeCrowComponent.jsx";

const reteComponents = [
  new MIDIReceiverComponent(),
  new MIDIEmitterComponent(),
  new OSCEmitterComponent(),
  new OSCReceiverComponent(),
  new MonomeGridComponent(),
  new MonomeCrowComponent(),
  new ConstantComponent(),
  new AddComponent(),
  new MultiplyComponent(),
  new MinComponent(),
  new QuantizerComponent(),
];

export { reteComponents };