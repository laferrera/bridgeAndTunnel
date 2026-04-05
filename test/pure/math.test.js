import assert from 'assert';
import { inp, noInp, callWorker } from '../helpers/nodeHelpers.js';

import { AddComponent } from '../../src/rete/components/AddComponent.jsx';
import { SubtractComponent } from '../../src/rete/components/SubtractComponent.jsx';
import { MultiplyComponent } from '../../src/rete/components/MultiplyComponent.jsx';
import { DivideComponent } from '../../src/rete/components/DivideComponent.jsx';
import { ModuloComponent } from '../../src/rete/components/ModuloComponent.jsx';
import { AbsComponent } from '../../src/rete/components/AbsComponent.jsx';
import { RoundComponent } from '../../src/rete/components/RoundComponent.jsx';
import { MinComponent } from '../../src/rete/components/MinComponent.jsx';
import { MaxComponent } from '../../src/rete/components/MaxComponent.jsx';
import { ClampComponent } from '../../src/rete/components/ClampComponent.jsx';
import { ScaleComponent } from '../../src/rete/components/ScaleComponent.jsx';
import { GateComponent } from '../../src/rete/components/GateComponent.jsx';
import { SelectComponent } from '../../src/rete/components/SelectComponent.jsx';
import { NoteToHzComponent } from '../../src/rete/components/NoteToHzComponent.jsx';
import { ChordComponent } from '../../src/rete/components/ChordComponent.jsx';
import { QuantizerComponent } from '../../src/rete/components/QuantizerComponent.jsx';
import { ConstantComponent } from '../../src/rete/components/ConstantComponent.jsx';

describe('Add', () => {
  it('adds two numbers', () => {
    const { outputs } = callWorker(AddComponent, inp({ num1: 2, num2: 3 }));
    assert.strictEqual(outputs.sum, 5);
  });
  it('defaults missing input to 0', () => {
    const { outputs } = callWorker(AddComponent, { num1: [7], num2: [] });
    assert.strictEqual(outputs.sum, 7);
  });
  it('guards against NaN', () => {
    const { outputs } = callWorker(AddComponent, inp({ num1: NaN, num2: 1 }));
    assert.strictEqual(outputs.sum, 0);
  });
});

describe('Subtract', () => {
  it('subtracts', () => {
    const { outputs } = callWorker(SubtractComponent, inp({ num1: 10, num2: 3 }));
    assert.strictEqual(outputs.difference, 7);
  });
  it('defaults missing to 0', () => {
    const { outputs } = callWorker(SubtractComponent, { num1: [5], num2: [] });
    assert.strictEqual(outputs.difference, 5);
  });
});

describe('Multiply', () => {
  it('multiplies', () => {
    const { outputs } = callWorker(MultiplyComponent, inp({ num1: 3, num2: 4 }));
    assert.strictEqual(outputs.product, 12);
  });
  it('defaults missing to 0', () => {
    const { outputs } = callWorker(MultiplyComponent, { num1: [5], num2: [] });
    assert.strictEqual(outputs.product, 0);
  });
});

describe('Divide', () => {
  it('divides', () => {
    const { outputs } = callWorker(DivideComponent, inp({ num1: 6, num2: 2 }));
    assert.strictEqual(outputs.quotient, 3);
  });
  it('returns 0 on divide by zero', () => {
    const { outputs } = callWorker(DivideComponent, inp({ num1: 5, num2: 0 }));
    assert.strictEqual(outputs.quotient, 0);
  });
});

describe('Modulo', () => {
  it('returns remainder', () => {
    const { outputs } = callWorker(ModuloComponent, inp({ num1: 7, num2: 3 }));
    assert.strictEqual(outputs.out, 1);
  });
  it('returns 0 on divide by zero', () => {
    const { outputs } = callWorker(ModuloComponent, inp({ num1: 5, num2: 0 }));
    assert.strictEqual(outputs.out, 0);
  });
});

describe('Abs', () => {
  it('makes negative positive', () => {
    const { outputs } = callWorker(AbsComponent, inp({ num: -5 }));
    assert.strictEqual(outputs.out, 5);
  });
  it('leaves positive unchanged', () => {
    const { outputs } = callWorker(AbsComponent, inp({ num: 3 }));
    assert.strictEqual(outputs.out, 3);
  });
});

describe('Round', () => {
  it('rounds up', () => {
    const { outputs } = callWorker(RoundComponent, inp({ num: 2.7 }));
    assert.strictEqual(outputs.out, 3);
  });
  it('rounds down', () => {
    const { outputs } = callWorker(RoundComponent, inp({ num: 2.3 }));
    assert.strictEqual(outputs.out, 2);
  });
});

describe('Min', () => {
  it('returns smaller value', () => {
    const { outputs } = callWorker(MinComponent, inp({ num1: 3, num2: 7 }));
    assert.strictEqual(outputs.out, 3);
  });
  it('returns smaller when first is larger', () => {
    const { outputs } = callWorker(MinComponent, inp({ num1: 9, num2: 2 }));
    assert.strictEqual(outputs.out, 2);
  });
});

describe('Max', () => {
  it('returns larger value', () => {
    const { outputs } = callWorker(MaxComponent, inp({ num1: 3, num2: 7 }));
    assert.strictEqual(outputs.out, 7);
  });
  it('returns larger when first is larger', () => {
    const { outputs } = callWorker(MaxComponent, inp({ num1: 9, num2: 2 }));
    assert.strictEqual(outputs.out, 9);
  });
});

describe('Clamp', () => {
  const config = { min: { value: 0 }, max: { value: 100 } };
  it('passes through value within range', () => {
    const { outputs } = callWorker(ClampComponent, inp({ num: 50 }), { config });
    assert.strictEqual(outputs.out, 50);
  });
  it('clamps above max', () => {
    const { outputs } = callWorker(ClampComponent, inp({ num: 200 }), { config });
    assert.strictEqual(outputs.out, 100);
  });
  it('clamps below min', () => {
    const { outputs } = callWorker(ClampComponent, inp({ num: -10 }), { config });
    assert.strictEqual(outputs.out, 0);
  });
});

describe('Scale', () => {
  const config = {
    inputMin: { value: 0 },
    inputMax: { value: 127 },
    outputMin: { value: 0 },
    outputMax: { value: 1 },
  };
  it('maps midpoint correctly', () => {
    const { outputs } = callWorker(ScaleComponent, inp({ num: 63.5 }), { config });
    assert.ok(Math.abs(outputs.out - 0.5) < 0.01);
  });
  it('maps min to outputMin', () => {
    const { outputs } = callWorker(ScaleComponent, inp({ num: 0 }), { config });
    assert.strictEqual(outputs.out, 0);
  });
  it('maps max to outputMax', () => {
    const { outputs } = callWorker(ScaleComponent, inp({ num: 127 }), { config });
    assert.strictEqual(outputs.out, 1);
  });
  it('returns outputMin when inMin === inMax', () => {
    const c = { inputMin: { value: 5 }, inputMax: { value: 5 }, outputMin: { value: 42 }, outputMax: { value: 100 } };
    const { outputs } = callWorker(ScaleComponent, inp({ num: 5 }), { config: c });
    assert.strictEqual(outputs.out, 42);
  });
});

describe('Gate', () => {
  const config = { threshold: { value: 10 } };
  it('outputs 1 above threshold', () => {
    const { outputs } = callWorker(GateComponent, inp({ num: 11 }), { config });
    assert.strictEqual(outputs.out, 1);
  });
  it('outputs 0 at or below threshold', () => {
    const { outputs } = callWorker(GateComponent, inp({ num: 10 }), { config });
    assert.strictEqual(outputs.out, 0);
  });
  it('outputs 0 below threshold', () => {
    const { outputs } = callWorker(GateComponent, inp({ num: 5 }), { config });
    assert.strictEqual(outputs.out, 0);
  });
});

describe('Select', () => {
  it('outputs a when control is 0', () => {
    const { outputs } = callWorker(SelectComponent, inp({ a: 10, b: 20, control: 0 }));
    assert.strictEqual(outputs.out, 10);
  });
  it('outputs b when control is truthy', () => {
    const { outputs } = callWorker(SelectComponent, inp({ a: 10, b: 20, control: 1 }));
    assert.strictEqual(outputs.out, 20);
  });
});

describe('NoteToHz', () => {
  it('A4 (69) = 440 Hz', () => {
    const { outputs } = callWorker(NoteToHzComponent, inp({ note: 69 }));
    assert.ok(Math.abs(outputs.out - 440) < 0.01);
  });
  it('A5 (81) = 880 Hz', () => {
    const { outputs } = callWorker(NoteToHzComponent, inp({ note: 81 }));
    assert.ok(Math.abs(outputs.out - 880) < 0.01);
  });
  it('A3 (57) = 220 Hz', () => {
    const { outputs } = callWorker(NoteToHzComponent, inp({ note: 57 }));
    assert.ok(Math.abs(outputs.out - 220) < 0.01);
  });
  it('defaults to A4 when no input', () => {
    const { outputs } = callWorker(NoteToHzComponent, noInp('note'));
    assert.ok(Math.abs(outputs.out - 440) < 0.01);
  });
});

describe('Chord', () => {
  const config = { chordType: { value: 'major' } };
  it('major triad: root + 4 + 7 semitones', () => {
    const { outputs } = callWorker(ChordComponent, inp({ root: 60 }), { config });
    assert.strictEqual(outputs.note1, 60);
    assert.strictEqual(outputs.note2, 64);
    assert.strictEqual(outputs.note3, 67);
  });
  it('minor triad: root + 3 + 7 semitones', () => {
    const c = { chordType: { value: 'minor' } };
    const { outputs } = callWorker(ChordComponent, inp({ root: 60 }), { config: c });
    assert.strictEqual(outputs.note2, 63);
    assert.strictEqual(outputs.note3, 67);
  });
  it('dom7 has four notes', () => {
    const c = { chordType: { value: 'dom7' } };
    const { outputs } = callWorker(ChordComponent, inp({ root: 60 }), { config: c });
    assert.strictEqual(outputs.note4, 70);
  });
  it('defaults root to 60 when disconnected', () => {
    const { outputs } = callWorker(ChordComponent, noInp('root'), { config });
    assert.strictEqual(outputs.note1, 60);
  });
});

describe('Quantizer', () => {
  // C major scale intervals
  const config = { scale: { value: [0, 2, 4, 5, 7, 9, 11] } };
  it('quantizes note 0 to scale degree 0', () => {
    const { outputs } = callWorker(QuantizerComponent, inp({ input: 0, shift: 0 }), { config });
    assert.strictEqual(outputs.output, 0);
  });
  it('applies shift', () => {
    const { outputs } = callWorker(QuantizerComponent, inp({ input: 0, shift: 1 }), { config });
    // shift 1 → scale index 1 → interval 2
    assert.strictEqual(outputs.output, 2);
  });
  it('defaults to [0] scale when config missing', () => {
    // scale=[0], input=5, shift=0 → baseOctave=5, scaleIndex=0, note=5*12+0=60
    const { outputs } = callWorker(QuantizerComponent, inp({ input: 5, shift: 0 }), {
      config: { scale: { value: null } }
    });
    assert.strictEqual(outputs.output, 60);
  });
});

describe('Constant', () => {
  it('outputs node.data.num', () => {
    const { outputs } = callWorker(ConstantComponent, {}, { num: 42 });
    assert.strictEqual(outputs.constant, 42);
  });
});
