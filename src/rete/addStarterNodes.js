
async function addStarterNodes(editor){
console.log('hi, adding starter nodes');
var mr1 = await new MIDIRecieveComponent().createNode({ num: 2 });
var mr2 = await new MIDIRecieveComponent().createNode({ num: 3 });
var osc = await new OSCEmitterComponent().createNode({ num: 3 });
var add = await components[1].createNode();

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
}

export default addStarterNodes;