# Bridge & Tunnel — Spec

## What it is

Bridge & Tunnel is a desktop app for routing and transforming signals between musical hardware and software. You build a graph of nodes — MIDI devices, OSC endpoints, Monome hardware, math operations — and wire them together to create routing logic that would otherwise require scripting or dedicated hardware.

The core metaphor is a signal flow graph: data enters through source and receiver nodes, flows through processing nodes, and exits through emitter nodes. Everything is numeric. Connections carry floating-point values.

---

## Core Concepts

**Nodes** are the building blocks. Each node has typed inputs and outputs (sockets), a configuration panel, and internal logic that runs every time the graph processes.

**Connections** carry numeric values between an output socket on one node and an input socket on another. All sockets share a single type (numeric), so any output can connect to any input.

**The Graph** is processed event-driven. Most nodes process reactively — when a hardware event arrives (MIDI note, OSC message, grid button press), the engine processes the affected nodes and propagates values downstream. Clock nodes are the exception: they drive processing autonomously on a timer.

**Config Panel** — selecting a node opens an inspector panel. Controls are defined per-node (dropdowns, sliders, toggles, text fields, buttons, piano keyboard, REPL console) and feed into the node's processing logic.

**Sessions** are auto-saved on every change. File → Save/Open supports named session files. Undo/redo is supported.

---

## Node Inventory

### Hardware I/O

#### MIDI Receiver
Listens to incoming MIDI note messages on a configurable port and channel.

**Outputs:** `noteOut` (0–127), `velocityOut` (0–127)

**Config:**
- Port — select from available MIDI input devices
- Channel — 1–16
- Note Off — toggle whether note-off messages trigger processing

---

#### MIDI Emitter
Sends MIDI note messages to a configurable port and channel.

**Inputs:** `noteIn`, `velocityIn`

**Config:**
- Port — select from available MIDI output devices
- Channel — 1–16
- Note Off — toggle whether to send a note-off after note-on

---

#### OSC Receiver
Listens for incoming OSC messages at a configurable address. Number of output sockets is adjustable to match the number of arguments in the expected message.

**Outputs:** `num1`, `num2`, ... (one per OSC argument)

**Config:**
- Port — UDP port to listen on
- Address — OSC address pattern (e.g. `/note_on`)
- Add/Remove Output — dynamically add or remove output sockets

---

#### OSC Emitter
Sends an OSC message to a configurable host, port, and address. Number of input sockets is adjustable.

**Inputs:** `num1`, `num2`, ... (each becomes an OSC argument)

**Config:**
- Host — destination IP or hostname
- Port — destination UDP port
- Address — OSC address pattern
- Add/Remove Input — dynamically add or remove input sockets

OSC arguments are sent in input-number order (`num1` first, `num2` second, etc.), regardless of connection order.

---

#### Grid (Monome Grid)
Bidirectional interface for Monome Grid hardware. Reports button presses as outputs; inputs control LED brightness.

**Inputs:** `x`, `y`, `state` (LED coordinate + brightness 0–15)
**Outputs:** `x`, `y`, `state` (button press coordinate + state 0/1)

**Config:**
- Latch — toggle whether button presses latch (hold state) or are momentary

---

#### Crow (Monome Crow)
Interface for Monome Crow eurorack module. Exposes a REPL console for sending Lua commands and viewing output. Dynamic input/output sockets for signal routing.

**Inputs:** `num1`, `num2`, ... (configurable count)
**Outputs:** `num1`, `num2`, ... (configurable count)

**Config:**
- REPL — interactive console; commands sent to Crow hardware, output displayed here
- Add/Remove Input / Add/Remove Output — dynamic socket management

**Status:** REPL is functional. Signal routing between node sockets and Crow hardware I/O is not yet connected.

---

### Sources

#### Constant
Outputs a fixed user-defined value.

**Output:** `constant`

**Config:**
- Value — numeric input field, editable directly in the node

---

#### Trigger
Emits a single pulse of 1 when the button is clicked, then resets to 0 on the next process cycle.

**Output:** `trigger`

---

#### Ableton Link
Syncs tempo and transport with Ableton Live and other Link-enabled apps on the local network. Outputs continuous beat position, phase within the quantum, current BPM, and a trigger pulse that fires once per quantum boundary.

**Outputs:** `beat` (absolute beat position), `phase` (0–quantum), `bpm`, `trigger` (1 on quantum boundary, else 0)

**Config:**
- BPM — initial tempo pushed to the Link session (range 20–300, step 0.5)
- Quantum — beats per loop/phase cycle: 1, 2, 4, or 8 (default 4)

The Link session starts automatically when an Ableton Link node is present in the graph and stops when it is removed. BPM and quantum changes from other peers on the network are reflected in the outputs. The trigger output is suitable for driving clocked nodes (Counter, Sample & Hold, Random, etc.) in tempo sync.

---

#### Clock
Emits a continuous stream of trigger pulses at a configurable BPM and subdivision. Unlike all other nodes, Clock drives processing autonomously — the interval runs in the main process and fires regardless of external events. On each tick the output is 1 for one process cycle, then 0 until the next tick.

**Output:** `trigger`

**Config:**
- BPM — tempo in beats per minute (default 120, range 1–300)
- Subdivision — pulse rate relative to a quarter note: Whole, Half, Quarter, Eighth, Sixteenth, 32nd (default Quarter)

**Formula:** `intervalMs = 240000 / (bpm × subdivision)`

The timer restarts only when BPM or subdivision changes. Session auto-saves do not reset the interval.

---

### Math

#### Add
Adds two numbers.

**Inputs:** `num1`, `num2`
**Output:** `sum`

---

#### Subtract
Subtracts the second input from the first.

**Inputs:** `num1`, `num2`
**Output:** `difference`

---

#### Multiply
Multiplies two numbers.

**Inputs:** `num1`, `num2`
**Output:** `product`

---

#### Divide
Divides the first input by the second. Outputs 0 if the divisor is 0.

**Inputs:** `num1`, `num2`
**Output:** `quotient`

---

#### Min
Passes the smaller of two input values.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

#### Max
Passes the larger of two input values.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

#### Abs
Returns the absolute value of the input.

**Input:** `num`
**Output:** `out`

---

#### Modulo
Returns `num1 % num2`. Outputs 0 if the divisor is 0.

**Inputs:** `num1`, `num2`
**Output:** `out`

---

#### Round
Rounds the input to the nearest integer.

**Input:** `num`
**Output:** `out`

---

#### Clamp
Limits the input to a configurable min/max range.

**Input:** `num`
**Output:** `out`

**Config:**
- Min — lower bound (default 0, range −1000–1000)
- Max — upper bound (default 127, range −1000–1000)

---

#### Scale
Remaps a value from one numeric range to another.

**Input:** `num`
**Output:** `out`

**Config:**
- In Min / In Max — the expected input range (default 0–127)
- Out Min / Out Max — the desired output range (default 0–127)

**Formula:** `outMin + (num − inMin) × (outMax − outMin) / (inMax − inMin)`

---

### Logic & Control

#### Gate
Outputs 1 if the input exceeds a threshold, 0 otherwise. Useful for detecting note-on/off, converting continuous values into triggers, or reading button states.

**Input:** `num`
**Output:** `out` (1 if `num > threshold`, else 0)

**Config:**
- Threshold — comparison value (default 0, range −1000–1000)

---

#### Toggle
Flips between 0 and 1 on each rising edge of the trigger input. Turns a momentary press into a latch. State persists until the next trigger.

**Input:** `trigger`
**Output:** `out` (0 or 1)

---

#### Select
Routes one of two inputs to the output based on a control signal. Control = 0 passes A; any non-zero value passes B.

**Inputs:** `a`, `b`, `control`
**Output:** `out`

---

#### Counter
Increments a count on each rising edge of the trigger input, wrapping at a configurable max. A rising edge on the reset input returns the count to 0.

**Inputs:** `trigger`, `reset`
**Output:** `count`

**Config:**
- Max — wrap value (default 8, range 1–64)
- Step — increment per trigger (default 1, range 1–16)

---

#### Sample & Hold
Latches the input value at the moment of a rising edge on the trigger. Holds that value until the next rising edge.

**Inputs:** `input`, `trigger`
**Output:** `out` (held value)

---

#### Random
Generates a new random value within a configurable range on each rising edge of the trigger input. Holds the last value between triggers.

**Input:** `trigger`
**Output:** `out` (random float in [min, max])

**Config:**
- Min — lower bound (default 0, range −1000–1000)
- Max — upper bound (default 127, range −1000–1000)

Wire through **Round** if integer output is needed.

---

### Music

#### Note → Hz
Converts a MIDI note number to a frequency in Hz using equal temperament tuning. Useful when sending to OSC targets that expect frequency rather than note number.

**Input:** `note` (MIDI note number, default 69)
**Output:** `out` (frequency in Hz)

**Formula:** `440 × 2^((note − 69) / 12)`

---

#### Chord
Takes a root note and a chord type and outputs up to four note values representing the chord tones.

**Input:** `root` (MIDI note number, default 60)
**Outputs:** `note1`, `note2`, `note3`, `note4`

**Config:**
- Chord Type — Major, Minor, Dom 7th, Major 7th, Minor 7th, Diminished, Augmented, Sus2, Sus4, Dim 7th

Note: for triads, `note4` repeats the root interval (semitone offset 0). Wire only the outputs you need.

---

#### Quantizer
Maps an input value onto a musical scale with an octave offset. Useful for converting continuous or stepped values into valid MIDI notes.

**Inputs:** `input` (value to quantize), `shift` (scale position offset)
**Output:** `output` (quantized MIDI note number)

**Config:**
- Scale — piano keyboard UI for selecting active scale degrees (defaults to natural minor)

**Logic:**
```
combined  = floor(shift + input)
octave    = floor(combined / scale.length)
index     = ((combined % scale.length) + scale.length) % scale.length
output    = (octave * 12) + scale[index]
```
The double-modulo ensures negative inputs map to the correct scale degree rather than wrapping below zero.

---

### Monitoring

#### View
Displays the current value passing through. Useful for debugging signal flow.

**Input:** `num`
**Output:** `num` (passthrough)

The display updates and emits an IPC event only when the value changes — unchanged values do not trigger re-renders.

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
| OSC in/out | `kiss-and-tell` | Working (listens on port 2626) |
| Monome Grid | `monome-grid` | Working |
| Monome Crow | `huginn-and-muninn` + `serialport` | REPL only |
| Ableton Link | `abletonlink` | Working (tempo + phase sync, trigger output) |
| USB hot-plug | `usb-detection` | Not yet integrated |

MIDI ports are enumerated at startup. A virtual "Bridge & Tunnel" MIDI port is created automatically.

OSC listens globally on port 2626; individual OSC Receiver nodes filter by address pattern.

---

## Planned

**Sequencer** — steps through a sequence of values on each trigger input.

**Crow signal routing** — wire Crow node inputs/outputs to actual Crow hardware CV/gate I/O.

**USB hot-plug** — automatically detect and respond to MIDI device connect/disconnect events.
