// const fs = require('fs')
// const files = fs.readdirSync('./')
// for (const file of files) {
//   require('./' + file)
// }

import { AddComponent } from "./AddComponent.jsx";
import { MIDIRecieveComponent } from "./MIDIRecieveComponent.jsx";
import { MIDISendComponent } from "./MIDISendComponent.jsx";
import { OSCEmitterComponent } from "./OSCEmitterComponent.jsx";
import { MonomeGridComponent } from "./MonomeGridComponent.jsx";

const reteComponents = [new MIDIRecieveComponent(), new MIDISendComponent(), new AddComponent(), new OSCEmitterComponent(), new MonomeGridComponent()];

export { reteComponents };