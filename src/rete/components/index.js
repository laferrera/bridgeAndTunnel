import { AddComponent } from "./AddComponent.jsx";
import { SubtractComponent } from "./SubtractComponent.jsx";
import { MultiplyComponent } from "./MultiplyComponent.jsx";
import { DivideComponent } from "./DivideComponent.jsx";
import { MaxComponent } from "./MaxComponent.jsx";
import { MinComponent } from "./MinComponent.jsx";
import { AbsComponent } from "./AbsComponent.jsx";
import { ModuloComponent } from "./ModuloComponent.jsx";
import { RoundComponent } from "./RoundComponent.jsx";
import { ClampComponent } from "./ClampComponent.jsx";
import { ScaleComponent } from "./ScaleComponent.jsx";
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
  new SubtractComponent(),
  new MultiplyComponent(),
  new DivideComponent(),
  new MaxComponent(),
  new MinComponent(),
  new AbsComponent(),
  new ModuloComponent(),
  new RoundComponent(),
  new ClampComponent(),
  new ScaleComponent(),
  new QuantizerComponent(),
];

export { reteComponents };