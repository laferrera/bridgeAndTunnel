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

### Constant
Outputs a fixed user-defined value.

**Output:** `constant`

**Config:**
- Value — numeric input field, editable directly in the node

---

### Add
Adds two numbers.

**Inputs:** `num1`, `num2`
**Output:** `sum`

---

### Subtract
Subtracts the second input from the first.

**Inputs:** `num1`, `num2`
**Output:** `difference`

---

### Multiply
Multiplies two numbers.

**Inputs:** `num1`, `num2`
**Output:** `product`

---

### Divide
Divides the first input by the second. Outputs 0 if the divisor is 0.

**Inputs:** `num1`, `num2`
**Output:** `quotient`

---

### Min
Passes the smaller of two input values.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

### Max
Passes the larger of two input values.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

### Abs
Returns the absolute value of the input.

**Input:** `num`
**Output:** `out`

---

### Modulo
Returns `num1 % num2`. Outputs 0 if the divisor is 0.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

### Round
Rounds the input to the nearest integer.

**Input:** `num`
**Output:** `out`

---

### Clamp
Limits the input to a configurable min/max range.

**Input:** `num`
**Output:** `out`

**Config:**
- Min — lower bound (default 0, range −1000–1000)
- Max — upper bound (default 127, range −1000–1000)

---

### Scale
Remaps a value from one numeric range to another.

**Input:** `num`
**Output:** `out`

**Config:**
- In Min / In Max — the expected input range (default 0–127)
- Out Min / Out Max — the desired output range (default 0–127)

**Formula:** `outMin + (num − inMin) × (outMax − outMin) / (inMax − inMin)`

---

### Quantizer
Maps an input value onto a musical scale with an octave offset. Useful for converting continuous or stepped values into valid MIDI notes.

**Inputs:** `input` (value to quantize), `shift` (scale position offset)
**Output:** `output` (quantized MIDI note number)

**Config:**
- Scale — piano keyboard UI for selecting active scale degrees (defaults to natural minor)

**Logic:** `output = (octave * 12) + scale[abs((shift + input) % scale.length)]`

---

### Counter
Increments a count on each rising edge of the trigger input, wrapping at a configurable max. A rising edge on the reset input returns the count to 0.

**Inputs:** `trigger`, `reset`
**Output:** `count`

**Config:**
- Max — wrap value (default 8, range 1–64)
- Step — increment per trigger (default 1, range 1–16)

---

### View
Displays the current value passing through. Useful for debugging signal flow.

**Input:** `num`
**Output:** `num` (passthrough)

---

### Trigger
Emits a single pulse of 1 when the button is clicked, then resets to 0 on the next process cycle.

**Output:** `trigger`

---

### Clock
Emits a continuous stream of trigger pulses at a configurable BPM and subdivision. Unlike all other nodes, Clock is a timing source — it drives processing autonomously rather than reacting to external events. The interval runs in the main process; on each tick the clock outputs 1 for one process cycle, then 0 until the next tick.

**Output:** `trigger`

**Config:**
- BPM — tempo in beats per minute (default 120, range 1–300)
- Subdivision — pulse rate relative to a quarter note: Whole, Half, Quarter, Eighth, Sixteenth, 32nd (default Quarter)

**Formula:** `intervalMs = 240000 / (bpm × subdivision)`

---

### Sample & Hold
Latches the input value at the moment of a rising edge on the trigger. Holds that value until the next rising edge.

**Inputs:** `input` (value to sample), `trigger`
**Output:** `out` (held value)

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
| MIDI in/out | `@julusian/midi` | Working |
| OSC in/out | `osc-emitter` / `osc-receiver` | Working (listens on port 2626) |
| Monome Grid | `monome-grid` | Working |
| Monome Crow | `huginn-and-muninn` + `serialport` | REPL only |
| Ableton Link | `abletonlink` | Not yet integrated |
| USB hot-plug | `usb-detection` | Not yet integrated |

MIDI ports are enumerated at startup. A virtual "Bridge & Tunnel" MIDI port is created automatically.

OSC listens globally on port 2626; individual OSC Receiver nodes filter by address pattern.

---

## Planned

**Random** — outputs random values within a configurable range on each trigger.

**Sequencer** — steps through a sequence of values on each trigger input.

**Ableton Link** — sync tempo and transport with Ableton Live and other Link-enabled apps.

**Crow signal routing** — wire Crow node inputs/outputs to actual Crow hardware CV/gate I/O.

**USB hot-plug** — automatically detect and respond to MIDI device connect/disconnect events.
