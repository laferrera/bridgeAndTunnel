import Rete from "rete";

const engine = new Rete.Engine('demo@0.1.0');
engine.register(numComponent);


(async () => {
  await engine.abort();
  await engine.process(map);
})();


// import Rete from "rete";

// const numSocket = new Rete.Socket('Number value');
// class NumComponent extends Rete.Component {
//   constructor() {
//     super('Number');
//   }

//   builder(node) {
//     let out = new Rete.Output('num', 'Number', numSocket);

//     node.addOutput(out);
//   }

//   worker(node, inputs, outputs) {
//     console.log('it works!');
//     //outputs['num'] = node.data.num;
//   }
// }
// const numComponent = new NumComponent();



// const engine = new Rete.Engine('demo@0.1.0');
// engine.register(numComponent);


// let map = {"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{},"inputs":{},"outputs":{"num":{"connections":[]}},"position":[102,54],"name":"Number"}}};

// (async () => {
//   await engine.abort();
//   await engine.process(map);
// })();