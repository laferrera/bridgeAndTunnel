// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import { AddComponent } from "./AddComponent.jsx";
import { MultiplyComponent } from "./MultiplyComponent.jsx";
import { MIDIRecieverComponent } from "./MIDIRecieverComponent.jsx";
import { MIDIEmitterComponent } from "./MIDIEmitterComponent.jsx";
import { OSCEmitterComponent } from "./OSCEmitterComponent.jsx";
import { MonomeGridComponent } from "./MonomeGridComponent.jsx";

const reteComponents = [
  new MIDIRecieverComponent(),
  new MIDIEmitterComponent(),
  new OSCEmitterComponent(),
  new MonomeGridComponent(),
  new AddComponent(),
  new MultiplyComponent(),
];

export { reteComponents };