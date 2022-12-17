import { AddComponent } from "./AddComponent.jsx";
import { MIDIReceiverComponent } from "./MIDIReceiverComponent.jsx";
import { OSCEmitterComponent } from "./OSCEmitterComponent.jsx";
import { MonomeGridComponent } from "./MonomeGridComponent.jsx";

async function addStarterNodes(editor){
var mr1 = await new MIDIReceiverComponent().createNode({ num: 2 });
var mr2 = await new MIDIReceiverComponent().createNode({ num: 3 });
var osc = await new OSCEmitterComponent().createNode({ num: 3 });
  var add = await new AddComponent().createNode({ num: 3 });

mr1.position = [80, 200];
mr2.position = [80, 400];
osc.position = [500, 300];
add.position = [500, 100];

editor.addNode(mr1);
editor.addNode(mr2);
editor.addNode(osc);
editor.addNode(add);

editor.connect(mr1.outputs.get("noteOut"), add.inputs.get("num1"));
editor.connect(mr1.outputs.get("velocityOut"), add.inputs.get("num2"));
editor.connect(add.outputs.get("sum"), osc.inputs.get("num1"));
editor.zoomToNodes();
}

export default addStarterNodes;