import assert from 'assert';
import { inp, callWorker } from '../helpers/nodeHelpers.js';

import { SampleAndHoldComponent } from '../../src/rete/components/SampleAndHoldComponent.jsx';
import { RandomComponent } from '../../src/rete/components/RandomComponent.jsx';
import { ToggleComponent } from '../../src/rete/components/ToggleComponent.jsx';
import { CounterComponent } from '../../src/rete/components/CounterComponent.jsx';

// Helper: call worker multiple times with evolving node state
function stepWorker(ComponentClass, steps, initialData = {}) {
  const instance = new ComponentClass();
  const node = { data: { ...initialData } };
  const results = [];
  for (const inputs of steps) {
    const outputs = {};
    instance.worker(node, inputs, outputs);
    results.push({ outputs: { ...outputs }, data: { ...node.data } });
  }
  return results;
}

describe('SampleAndHold', () => {
  const base = { _held: 0, _prevTrigger: 0, config: {} };

  it('captures input on rising edge', () => {
    const steps = [
      inp({ input: 42, trigger: 0 }),  // low
      inp({ input: 42, trigger: 1 }),  // rising edge — capture
    ];
    const [, second] = stepWorker(SampleAndHoldComponent, steps, { ...base });
    assert.strictEqual(second.outputs.out, 42);
  });

  it('holds value between triggers', () => {
    const steps = [
      inp({ input: 99, trigger: 1 }),  // rising edge
      inp({ input: 0,  trigger: 1 }),  // high — no new capture
      inp({ input: 0,  trigger: 0 }),  // falls
    ];
    const results = stepWorker(SampleAndHoldComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.out, 99);
    assert.strictEqual(results[2].outputs.out, 99);
  });

  it('does not capture on sustained high signal', () => {
    const steps = [
      inp({ input: 10, trigger: 1 }),  // rising edge — capture 10
      inp({ input: 20, trigger: 1 }),  // still high — no capture
    ];
    const results = stepWorker(SampleAndHoldComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.out, 10);
  });
});

describe('Random', () => {
  const config = { min: { value: 0 }, max: { value: 100 } };
  const base = { _held: 0, _prevTrigger: 0, config };

  it('output stays in [min, max] after trigger', () => {
    const steps = [
      inp({ trigger: 0 }),
      inp({ trigger: 1 }),  // rising edge
    ];
    const results = stepWorker(RandomComponent, steps, { ...base });
    const v = results[1].outputs.out;
    assert.ok(v >= 0 && v <= 100, `Expected 0–100, got ${v}`);
  });

  it('holds value until next trigger', () => {
    const steps = [
      inp({ trigger: 1 }),  // capture
      inp({ trigger: 1 }),  // still high — no new value
      inp({ trigger: 0 }),  // falls
    ];
    const results = stepWorker(RandomComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.out, results[0].outputs.out);
    assert.strictEqual(results[2].outputs.out, results[0].outputs.out);
  });

  it('generates new value on second rising edge', () => {
    // Run 100 times: statistically almost certain to differ
    let diffCount = 0;
    for (let i = 0; i < 100; i++) {
      const steps = [
        inp({ trigger: 1 }),  // first capture
        inp({ trigger: 0 }),
        inp({ trigger: 1 }),  // second capture
      ];
      const results = stepWorker(RandomComponent, steps, { ...base });
      if (results[0].outputs.out !== results[2].outputs.out) diffCount++;
    }
    assert.ok(diffCount > 80, 'Expected values to differ across triggers');
  });
});

describe('Toggle', () => {
  const base = { _state: 0, _prevTrigger: 0 };

  it('flips 0→1 on rising edge', () => {
    const steps = [
      inp({ trigger: 0 }),
      inp({ trigger: 1 }),
    ];
    const results = stepWorker(ToggleComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.out, 1);
  });

  it('flips 1→0 on second rising edge', () => {
    const steps = [
      inp({ trigger: 1 }),  // 0→1
      inp({ trigger: 0 }),
      inp({ trigger: 1 }),  // 1→0
    ];
    const results = stepWorker(ToggleComponent, steps, { ...base });
    assert.strictEqual(results[2].outputs.out, 0);
  });

  it('holds state on sustained high', () => {
    const steps = [
      inp({ trigger: 1 }),  // 0→1
      inp({ trigger: 1 }),  // still high
    ];
    const results = stepWorker(ToggleComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.out, 1);
  });
});

describe('Counter', () => {
  const config = { max: { value: 4 }, step: { value: 1 } };
  const base = { _count: 0, _prevTrigger: 0, _prevReset: 0, config };

  it('increments on rising edge', () => {
    const steps = [
      inp({ trigger: 0, reset: 0 }),
      inp({ trigger: 1, reset: 0 }),
    ];
    const results = stepWorker(CounterComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.count, 1);
  });

  it('wraps around at max', () => {
    const steps = [
      inp({ trigger: 1, reset: 0 }),  // 1
      inp({ trigger: 0, reset: 0 }),
      inp({ trigger: 1, reset: 0 }),  // 2
      inp({ trigger: 0, reset: 0 }),
      inp({ trigger: 1, reset: 0 }),  // 3
      inp({ trigger: 0, reset: 0 }),
      inp({ trigger: 1, reset: 0 }),  // 4 % 4 = 0 → wraps
    ];
    const results = stepWorker(CounterComponent, steps, { ...base });
    assert.strictEqual(results[6].outputs.count, 0);
  });

  it('resets to 0 on rising edge of reset', () => {
    const steps = [
      inp({ trigger: 1, reset: 0 }),  // count = 1
      inp({ trigger: 0, reset: 0 }),
      inp({ trigger: 1, reset: 0 }),  // count = 2
      inp({ trigger: 0, reset: 0 }),
      inp({ trigger: 0, reset: 1 }),  // reset rising edge
    ];
    const results = stepWorker(CounterComponent, steps, { ...base });
    assert.strictEqual(results[4].outputs.count, 0);
  });

  it('does not double-increment on sustained trigger', () => {
    const steps = [
      inp({ trigger: 1, reset: 0 }),
      inp({ trigger: 1, reset: 0 }),  // still high
    ];
    const results = stepWorker(CounterComponent, steps, { ...base });
    assert.strictEqual(results[1].outputs.count, 1);
  });
});
