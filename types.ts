

export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

export interface Ant {
  id: number;
  x: number;
  y: number;
  direction: Direction;
  color: string;
}

export interface CellData {
  x: number;
  y: number;
  midiNote: number;
  isActive: boolean;
  age: number; // For visual decay effects
}

export type Grid = boolean[][];

export interface LifeRule {
  birth: number[];
  survival: number[];
}

export interface MidiDevice {
  id: string;
  name: string;
}

export interface Preset {
  name: string;
  size: number;
  center: number;
  bpm: number;
  ants: number;
  rule: string;
  id?: number;
}

export type NoteLabelType = 'midi' | 'pitch' | 'none';
export type CellShape = 'square' | 'circle' | 'rounded';
export type ColorTheme = 'cyan' | 'purple' | 'green' | 'orange' | 'rose' | 'mono' | 'rainbow';
export type RenderMode = 'block' | 'fluid' | 'terminal' | 'laser' | 'neon' | 'isometric' | 'glitch' | 'char';
export type InitMode = 'auto' | 'manual';

export interface VisualTweaks {
    bloomStrength: number; // 0-100 (px)
    decayTime: number; // 0-2000 (ms)
    gridGap: number; // 0-10 (px)
    tilt: number; // 0-60 (deg) for 3D
    rotation: number; // 0-360 (deg)
    aliveChar: string; // For char mode
    deadChar: string; // For char mode
    shake: number; // 0-100 (intensity)
    screenFlash: boolean; // Global flash on note
    zoom: number; // 0.1 - 5.0
    cameraFollow: boolean;
    cameraFollowAntId: number; // Index of ant to follow
}

export interface VisualSettings {
  noteLabel: NoteLabelType;
  cellShape: CellShape;
  colorTheme: ColorTheme;
  renderMode: RenderMode;
  tweaks: VisualTweaks;
}