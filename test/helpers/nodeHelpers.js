// inp({ note: 69 }) → { note: [69] }  (Rete input array convention)
export const inp = (map) =>
  Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [v]]));

// noInp('key1', 'key2') → { key1: [], key2: [] }  (disconnected inputs)
export const noInp = (...keys) =>
  Object.fromEntries(keys.map((k) => [k, []]));

// Call a component's worker and return { outputs, node }
export function callWorker(ComponentClass, inputs = {}, nodeData = {}) {
  const instance = new ComponentClass();
  const node = { data: nodeData };
  const outputs = {};
  instance.worker(node, inputs, outputs);
  return { outputs, node };
}
