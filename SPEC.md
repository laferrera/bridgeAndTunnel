# Bridge & Tunnel — Spec

## What it is

Bridge & Tunnel is a desktop app for routing and transforming signals between musical hardware and software. You build a graph of nodes — MIDI devices, OSC endpoints, Monome hardware, math operations — and wire them together to create routing logic that would otherwise require scripting or dedicated hardware.

The core metaphor is a signal flow graph: data enters through receiver nodes, flows through processing nodes, and exits through emitter nodes. Everything is numeric. Connections carry floating-point values.

---

## Core Concepts

**Nodes** are the building blocks. Each node has typed inputs and outputs (sockets), a configuration panel, and internal logic that runs every time the graph processes.

**Connections** carry numeric values between an output socket on one node and an input socket on another. All sockets share a single type (numeric), so any output can connect to any input.

**The Graph** is processed reactively — any time a hardware event arrives (MIDI note, OSC message, grid button press), the engine processes the affected nodes and propagates values downstream through the connection graph.

**Config Panel** — selecting a node opens an inspector panel. Controls are defined per-node (dropdowns, sliders, toggles, text fields, buttons, piano keyboard, REPL console) and feed into the node's processing logic.

**Sessions** are auto-saved on every change. File → Save/Open supports named session files. Undo/redo is supported.

---

## Node Inventory

### MIDI Receiver
Listens to incoming MIDI note messages on a configurable port and channel.

**Outputs:** `noteOut` (0–127), `velocityOut` (0–127)

**Config:**
- Port — select from available MIDI input devices
- Channel — 1–16
- Note Off — toggle whether note-off messages trigger processing

---

### MIDI Emitter
Sends MIDI note messages to a configurable port and channel.

**Inputs:** `noteIn`, `velocityIn`

**Config:**
- Port — select from available MIDI output devices
- Channel — 1–16
- Note Off — toggle whether to send a note-off after note-on

---

### OSC Receiver
Listens for incoming OSC messages at a configurable address. Number of output sockets is adjustable to match the number of arguments in the expected message.

**Outputs:** `num1`, `num2`, ... (one per OSC argument)

**Config:**
- Port — UDP port to listen on
- Address — OSC address pattern (e.g. `/note_on`)
- Add/Remove Output — dynamically add or remove output sockets

---

### OSC Emitter
Sends an OSC message to a configurable host, port, and address. Number of input sockets is adjustable.

**Inputs:** `num1`, `num2`, ... (each becomes an OSC argument)

**Config:**
- Host — destination IP or hostname
- Port — destination UDP port
- Address — OSC address pattern
- Add/Remove Input — dynamically add or remove input sockets

---

### Grid (Monome Grid)
Bidirectional interface for Monome Grid hardware. Reports button presses as outputs; inputs control LED brightness.

**Inputs:** `x`, `y`, `state` (LED coordinate + brightness 0–15)
**Outputs:** `x`, `y`, `state` (button press coordinate + state 0/1)

**Config:**
- Latch — toggle whether button presses latch (hold state) or are momentary

---

### Crow (Monome Crow)
Interface for Monome Crow eurorack module. Exposes a REPL console for sending Lua commands and viewing output. Dynamic input/output sockets for signal routing.

**Inputs:** `num1`, `num2`, ... (configurable count)
**Outputs:** `num1`, `num2`, ... (configurable count)

**Config:**
- REPL — interactive console; commands sent to Crow hardware, output displayed here
- Add/Remove Input / Add/Remove Output — dynamic socket management

**Status:** REPL is functional. Signal routing between node sockets and Crow hardware I/O is not yet connected.

---

### Add
Adds two numbers.

**Inputs:** `num1`, `num2`
**Output:** `sum`

---

### Multiply
Multiplies two numbers.

**Inputs:** `num1`, `num2`
**Output:** `product`

---

### Min
Passes the smaller of two input values.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

### Constant
Outputs a fixed user-defined value.

**Output:** `constant`

**Config:**
- Value — numeric input field, editable directly in the node

---

### Quantizer
Maps an input value onto a musical scale with an octave offset. Useful for converting continuous or stepped values into valid MIDI notes.

**Inputs:** `input` (value to quantize), `shift` (scale position offset)
**Output:** `output` (quantized MIDI note number)

**Config:**
- Scale — piano keyboard UI for selecting active scale degrees (defaults to natural minor)

**Logic:** `output = (octave * 12) + scale[abs((shift + input) % scale.length)]`

---

## Planned Nodes

These are referenced in development notes but not yet built.

**Clock** — generates tempo-synced triggers at a configurable BPM and division. Would output a gate signal or tick count.

**Random** — outputs random values within a configurable range, triggered by an input or on a clock.

**Sequencer** — steps through a sequence of values (notes, velocities, etc.) on each trigger input.

**Ableton Link** — sync tempo and transport with Ableton Live and other Link-enabled apps. The `abletonlink` library is installed but not yet integrated.

**Additional math nodes** — Divide, Modulo, Scale/Map (remap a value from one range to another), Sample & Hold, and others as needed.

---

## UI Behaviors

**Editor canvas** — pan with middle mouse / drag, zoom with scroll. Nodes can be multi-selected (drag selection or shift-click) and moved as a group.

**Context menu** — right-click on canvas to add a new node; right-click on a node for node-specific actions (e.g. Add Input on OSC Emitter).

**Inspector panel** — appears on node selection. Renders controls dynamically from the node's config schema. Changes take effect immediately and are auto-saved.

**Undo/Redo** — full history for node creation, deletion, movement, and connection changes. Keyboard shortcuts via history plugin.

**File operations** — File menu supports Save, Save As, Open, and Recent Documents. Sessions are also auto-saved to electron-store on every change.

---

## Hardware

| Device | Library | Status |
|--------|---------|--------|
| MIDI in/out | `midi` | Working |
| OSC in/out | `kiss-and-tell` | Working |
| Monome Grid | `monome-grid` | Working |
| Monome Crow | `huginn-and-muninn` + `serialport` | REPL only |
| Ableton Link | `abletonlink` | Not yet integrated |
| USB hot-plug | `usb-detection` | Installed, not yet wired |

MIDI ports are enumerated at startup. A virtual "Bridge & Tunnel" MIDI port is created automatically.

OSC listens globally on port 2626; individual OSC Receiver nodes filter by address pattern.
