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
| Monome Crow | REPL only |
| Ableton Link | Not yet integrated |

---

## Nodes

**I/O**
- **MIDI Receiver** — listens for MIDI note messages on a configurable port and channel
- **MIDI Emitter** — sends MIDI note messages to a configurable port and channel
- **OSC Receiver** — listens for OSC messages at a configurable address (dynamic output count)
- **OSC Emitter** — sends OSC messages to a host/port/address (dynamic input count)
- **Grid** — bidirectional Monome Grid interface; button presses out, LED brightness in
- **Crow** — Monome Crow REPL console and signal routing

**Math**
- **Constant** — outputs a fixed value
- **Add / Subtract / Multiply / Divide** — basic arithmetic
- **Min / Max / Abs / Modulo / Round** — utility math
- **Clamp** — limits a value to a configurable min/max range
- **Scale** — remaps a value from one numeric range to another
- **Counter** — increments on each rising trigger edge, wraps at a configurable max
- **Quantizer** — maps a value onto a musical scale

**Utils**
- **View** — displays the current value passing through (passthrough node)
- **Trigger** — emits a single 1 pulse on button click, then resets to 0

---

## Setup

Requires Node 20 and [nvm](https://github.com/nvm-sh/nvm).

```bash
nvm use
git submodule update --init --recursive
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
npm run lint     # ESLint check
npm run rebuild  # Rebuild native modules for Electron
npm run package  # Package app for distribution
npm run make     # Create platform installers (DMG, EXE, DEB/RPM)
```

---

## Session Management

Sessions auto-save on every change. Use **File → Save / Save As / Open** for named session files. Full undo/redo is supported.
