import { Action } from 'rete-history-plugin';

export default class DataChangeAction extends Action {
  constructor(prev, next, node) {
    super()
    this.prev = prev;
    this.next = next;
    this.node = node;
  }
  undo() {
    this.node.data.config = (this.prev);
  }
  redo() {
    this.node.data.config = (this.next);
  }
}
