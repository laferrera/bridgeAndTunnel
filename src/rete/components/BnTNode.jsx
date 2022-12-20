import Rete from "rete";
import { ReactNode } from "./ReactNode.jsx";
import { configBuilder } from "./utils.js";

export class BnTNode extends Rete.Component {
  constructor(props) {
    super(props);
    this.data.component = ReactNode;
  }

  builder(node, config) {
    configBuilder(node, config);
    return node;
  }

}