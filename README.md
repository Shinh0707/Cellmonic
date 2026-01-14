# Cellmonic

Cellmonicは、ライフゲームとラングトンのアリを融合させた生成的MIDIシーケンサーです。独自の螺旋グリッド上でセルが相互作用し、予測不能かつ調和のとれた音楽パターンをリアルタイムに生み出します。

---

**Cellmonic** is a generative MIDI sequencer that creates music using a hybrid simulation of **Conway's Game of Life** and **Langton's Ant**, mapped onto a harmonic spiral grid.

ProtoPedia → https://protopedia.net/prototype/8046

## コンセプト / Concept

ライフゲームを利用したシンセサイザーの制作において、「ライフゲーム単体ではパターンが早期に収束・固定化してしまい、初期状態以降の不確実性（予測不可能性）が維持されない」という課題がありました。

そこで、同じセル・オートマトンの文脈でありながら、単純なルールで複雑な挙動を生み出す**「ラングトンのアリ（Langton's Ant）」**を導入しました。自律的に動き回る「アリ」がセルを反転させ続けることで、ライフゲームの収束を防ぎ、持続的な変化と偶発性を確保しています。

今後は、この生成システムを自身の作品制作へ本格的に導入していく予定です。

## システム構成 / System Architecture

Cellmonicは、以下の要素が相互に作用して音楽を生成します。

### 1. Hybrid Generative Engine (ハイブリッド生成エンジン)
相互作用する2つのアルゴリズムが、リズムとメロディを生成します。
*   **Game of Life (Global)**: 盤面全体に作用する物理法則。リズムの土台や和音のテクスチャを作ります。
*   **Langton's Ant (Local)**: 盤面を走り回るエージェント。リードメロディや突発的なアクセントを生み出し、盤面をかき混ぜて停滞を防ぎます。

### 2. Harmonic Spiral Grid (調和螺旋グリッド)
音楽的な破綻を防ぐための独自のグリッド構造です。
*   **空間と音程の対応**: 中心から螺旋状に音程が配置されています。
*   **協和音の近接**: X軸方向に完全5度、Y軸方向に長3度など、**音楽的に協和する音同士がグリッド上で隣接する**ように設計されています。
*   これにより、ランダムな図形やカオスな動きであっても、不協和音が鳴りにくく、音楽的に成立しやすい構造になっています。

### 3. I/O & Interaction
*   **Input**: マウスによるセルの描画、パラメータ操作（BPM、ルール、アリの数）。
*   **Output**: Web MIDI APIを通じた外部DAW/ハードウェアシンセへのMIDI送信。
*   **Visual**: ReactによるリアルタイムレンダリングとVJ用エフェクト。

---

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
