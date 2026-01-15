# Cellmonic

Cellmonicは、ライフゲームとラングトンのアリを融合させた生成的MIDIシーケンサーです。独自の螺旋グリッド上でセルが相互作用し、予測不能かつ調和のとれた音楽パターンをリアルタイムに生み出します。

---

**Cellmonic** is a generative MIDI sequencer that creates music using a hybrid simulation of **Conway's Game of Life** and **Langton's Ant**, mapped onto a harmonic spiral grid.

ProtoPedia → https://protopedia.net/prototype/8046

## コンセプト / Concept

ライフゲームを利用したシンセサイザーの制作において、「ライフゲーム単体ではパターンが早期に収束・固定化してしまい、初期状態以降の不確実性（予測不可能性）が維持されない」という課題がありました。

そこで、同じセル・オートマトンの文脈でありながら、単純なルールで複雑な挙動を生み出す「ラングトンのアリ（Langton's Ant）」を導入しました。自律的に動き回る「アリ」がセルを反転させ続けることで、ライフゲームの収束を防ぎ、持続的な変化と偶発性を確保しています。
