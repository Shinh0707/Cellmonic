# Cellmonic

**Cellmonic** is a generative MIDI sequencer that creates music using a hybrid simulation of **Conway's Game of Life** and **Langton's Ant**, mapped onto a harmonic spiral grid.

## Features

*   **Generative Engines**:
    *   **Game of Life**: Cellular automata rules drive the evolving patterns.
    *   **Langton's Ant**: Autonomous agents that traverse the grid, creating loops and chaotic structures.
*   **Harmonic Grid**: A unique spiral layout where spatial proximity corresponds to harmonic intervals (fifths, thirds), ensuring musical consonance even in chaotic states.
*   **MIDI Output**: Connect to external synthesizers, DAWs (like Ableton Live, Logic Pro), or virtual MIDI ports.
*   **Visual Customization**: Multiple rendering modes (Neon, Terminal, Isometric, etc.) and visual effects (Bloom, Decay, Camera Follow).
*   **Presets**: Save and load your favorite configurations.

## Getting Started

1.  **Open the App**: Launch Cellmonic in your browser.
2.  **Setup MIDI**: Open the **Grid** tab (Settings icon) and select a MIDI Output device.
    *   *Tip: Use a virtual MIDI driver (IAC on Mac, LoopBe1 on Windows) to route MIDI to your DAW.*
3.  **Play**: Go to the **Sim** tab (Waveform icon) and press Play.
4.  **Interact**: Click on the grid to add/remove cells, or add "Ants" to create self-sustaining melodies.

## Technologies

Built with React, TypeScript, and the Web MIDI API.
