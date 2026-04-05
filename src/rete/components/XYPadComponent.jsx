import Rete from "rete";
import { BnTNode } from "./BnTNode.jsx";
import { numSocket } from "./numSocket.js";
import config from "../nodeConfigs/xypadConfig.js";

export class XYPadComponent extends BnTNode {
  constructor() {
    super("XY Pad");
    this.path = ["Utils"];
  }

  builder(node) {
    super.builder(node, config);
    node.addOutput(new Rete.Output("x", "X", numSocket));
    node.addOutput(new Rete.Output("y", "Y", numSocket));
    return node;
  }

  worker(node, inputs, outputs) {
    const x    = node.data.config?.x?.value    ?? 0.5;
    const y    = node.data.config?.y?.value    ?? 0.5;
    const xMin = node.data.config?.xMin?.value ?? 0;
    const xMax = node.data.config?.xMax?.value ?? 127;
    const yMin = node.data.config?.yMin?.value ?? 0;
    const yMax = node.data.config?.yMax?.value ?? 127;
    outputs["x"] = xMin + x * (xMax - xMin);
    outputs["y"] = yMin + y * (yMax - yMin);
  }
}
