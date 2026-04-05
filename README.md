# Bridge & Tunnel

A desktop app for routing and transforming signals between musical hardware and software. Build a graph of nodes — MIDI devices, OSC endpoints, Monome hardware, math operations — and wire them together to create routing logic without scripting.

Data enters through receiver nodes, flows through processing nodes, and exits through emitter nodes. All connections carry floating-point values.

---

## Hardware Support

| Device | Status |
|--------|--------|
| MIDI in/out | Working |
| OSC in/out (UDP, port 2626) | Working |
| Monome Grid | Working |
| Monome Arc | Working |
| Monome Crow | Working |
| Ableton Link | Working |

---

## Nodes

**I/O**
- **MIDI Receiver** — listens for MIDI note messages on a configurable port and channel
- **MIDI Emitter** — sends MIDI note messages to a configurable port and channel
- **OSC Receiver** — listens for OSC messages at a configurable address (dynamic output count)
- **OSC Emitter** — sends OSC messages to a host/port/address (dynamic input count)
- **Grid** — bidirectional Monome Grid interface; button presses out, LED brightness in
- **Arc** — Monome Arc rotary encoder interface; delta outputs per encoder, ring LED brightness inputs
- **Crow** — Monome Crow eurorack module; REPL console, CV input/output signal routing

**Sources**
- **Constant** — outputs a fixed value
- **Trigger** — emits a single 1 pulse on button click, then resets to 0
- **Clock** — emits trigger pulses at a configurable BPM and subdivision
- **Ableton Link** — syncs to a Link session; outputs beat, phase, BPM, and a per-quantum trigger

**Math**
- **Add / Subtract / Multiply / Divide** — basic arithmetic
- **Min / Max / Abs / Modulo / Round** — utility math
- **Clamp** — limits a value to a configurable min/max range
- **Scale** — remaps a value from one numeric range to another
- **Counter** — increments on each rising trigger edge, wraps at a configurable max
- **Sample & Hold** — latches input on a rising trigger edge, holds until next trigger
- **Random** — outputs a random value in a configurable range on each trigger
- **Quantizer** — maps a value onto a musical scale
- **Note → Hz** — converts a MIDI note number to a frequency in Hz
- **Chord** — outputs up to 4 note values for a given root and chord type

**Logic**
- **Gate** — outputs 1 above a threshold, 0 otherwise
- **Toggle** — flips between 0 and 1 on each rising trigger edge
- **Select** — routes A or B to output based on a control signal

**Utils**
- **View** — displays the current value passing through (passthrough node)

---

## Setup

Requires Node v17.5.0 and [nvm](https://github.com/nvm-sh/nvm).

```bash
nvm use v17.5.0
npm install --legacy-peer-deps
cd rete-context-menu-plugin-react && npm install --legacy-peer-deps && npm run build && cd ..
npm run rebuild
npm start
```

> `npm run rebuild` recompiles native modules (MIDI, serial port) for Electron's Node runtime. Re-run this after any native dependency changes.

---

## Commands

```bash
npm start        # Start dev build with hot reload
npm test         # Run the test suite
npm run lint     # ESLint check
npm run rebuild  # Rebuild native modules for Electron
npm run package  # Package app for distribution
npm run make     # Create platform installers (DMG, EXE, DEB/RPM)
```

---

## Testing

The test suite covers node worker logic using [Mocha](https://mochajs.org/). No hardware or Electron runtime required.

```bash
npm test
```

Tests live in `test/`:
- `test/pure/math.test.js` — all pure math and logic nodes (Add, Scale, NoteToHz, Chord, etc.)
- `test/stateful/stateful.test.js` — stateful nodes with rising-edge trigger logic (Counter, SampleAndHold, Random, Toggle)

Hardware nodes (MIDI, OSC, Monome, Ableton Link) are not covered — they require live hardware or a more elaborate mock.

To add tests for a new node, call `callWorker(ComponentClass, inputs, nodeData)` from `test/helpers/nodeHelpers.js`. The `inputs` object uses Rete's array convention: `{ key: [value] }` for connected inputs, `{ key: [] }` for disconnected.

---

## Session Management

Sessions auto-save on every change. Use **File → Save / Save As / Open** for named session files. Full undo/redo is supported.
