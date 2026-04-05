# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup (fresh clone)

```bash
nvm use v17.5.0                           # must match .nvmrc; native modules fail on v22+
npm install --legacy-peer-deps            # --legacy-peer-deps due to local rete fork version
# Build the context menu plugin (ships without a build artifact)
cd rete-context-menu-plugin-react && npm install --legacy-peer-deps && npm run build && cd ..
npm run rebuild                           # recompile native modules for Electron's Node runtime
```

`kiss-and-tell` (OSC library) is expected at `../kiss-and-tell` — a stub at `./kiss-and-tell-stub` is used when unavailable, making OSC a no-op.

`rete`, `rete-context-menu-plugin-react`, and `huginn-and-muninn` are inlined directories (formerly git submodules). Do not treat them as submodules.

## Commands

```bash
npm start          # Start dev build (electron-forge with webpack + hot reload)
npm test           # Run test suite (Mocha, no Electron required)
npm run lint       # ESLint check
npm run rebuild    # Rebuild all native modules for Electron (serialport, midi, usb-detection, etc.)
npm run package    # Package app for distribution
npm run make       # Create platform installers (DMG, EXE, DEB/RPM)
```

Tests live in `test/`. `test/helpers/setup.js` registers Babel and mocks `rete`, `ReactNode`, and `globalUtils` so component workers can be instantiated without a running editor. Use `callWorker(ComponentClass, inputs, nodeData)` from `test/helpers/nodeHelpers.js` to test any node.

## Architecture

Bridge & Tunnel is an Electron desktop app with a visual node-based editor for routing MIDI and OSC data between hardware and software.

### Three-process architecture

**Main process** (`src/main.js`, `src/main/`) — hardware I/O, file operations, session persistence
- `engine.js` — core Rete execution engine; owns all hardware connections (MIDI, OSC, Crow, Monome Grid, Ableton Link)
- `menu.js` — application menu, file save/load
- `midi/` — MIDI input/output stream wrappers

**Renderer process** (`src/renderer.js`, `src/renderer/`, `src/rete/`) — React UI
- `src/rete/rete.jsx` — sets up the Rete editor, plugins, and node registry
- `src/rete/components/` — all node types (extend `BnTNode`)
- `src/renderer/panel/` — inspector panel, renders dynamic UI from node config schemas

**Preload** (`src/preload.js`) — exposes a safe `contextBridge` IPC API between main and renderer.

### Data flow

1. User builds a graph in the Rete visual editor (renderer)
2. Node changes send IPC messages to main: `rete:handleUpdateNode`, `rete:handleAddNode`, `rete:engine-process-json`
3. Main process engine processes the graph, routing data through MIDI/OSC hardware
4. Hardware events flow back to renderer via IPC: `midi-message`, `midi-device-update`, `receive-lines-from-crow`

### Node system

Each node type has two pieces:
- **Component** (`src/rete/components/SomethingComponent.jsx`) — extends `BnTNode`, implements `builder()` and `worker()` methods
- **Config** (`src/rete/nodeConfigs/somethingConfig.js`) — schema defining the node's settings and UI controls

The panel (`src/renderer/panel/panel.jsx`) reads config schemas and dynamically renders controls: `select`, `slider`, `switch`, `button`, `repl`, `piano`, `textInput`.

### Event bus

`src/rete/emitterEmitter.js` is a shared EventEmitter that coordinates between nodes and the engine within the renderer/main process. Nodes emit events like `engine:emit-midi-message`; the engine listens and forwards to hardware.

### Git submodules

- `rete/` — forked Rete.js visual editor
- `rete-context-menu-plugin-react/` — forked context menu plugin
- `huginn-and-muninn/` — Crow hardware integration (Monome)

### Build

Webpack has separate configs for main (`webpack.main.config.js`) and renderer (`webpack.renderer.config.js`), with shared rules in `webpack.rules.js`. Babel handles JSX and TypeScript. Native modules (serialport, midi, usb-detection) require `node-loader` and `@electron/rebuild` — run `npm run rebuild` when changing native dependencies.
