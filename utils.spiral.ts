

import { Point } from './types';

// Defaults
export const DEFAULT_GRID_SIZE = 11;
export const DEFAULT_CENTER_NOTE = 60; // Middle C (C4)

export const createEmptyGrid = (size: number): boolean[][] => {
  return Array.from({ length: size }, () => Array(size).fill(false));
};

// Map specific (x,y) to a MIDI note based on a harmonic grid layout
// Center is customizable (default C4).
// x-axis: +7 (P5) right, -5 (P4) left
// y-axis: +4 (M3) down, -8 (m6) up
export const mapGridToMidi = (x: number, y: number, size: number, centerNote: number): number => {
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  
  const di = x - cx;
  const dj = y - cy;
  
  let note = centerNote;

  // i direction (x)
  if (di > 0) {
      note += 7 * di;
  } else if (di < 0) {
      note -= 5 * Math.abs(di);
  }

  // j direction (y)
  if (dj > 0) {
      note += 4 * dj;
  } else if (dj < 0) {
      note -= 8 * Math.abs(dj);
  }
  
  // Clamp to valid MIDI range (0-127)
  return Math.max(0, Math.min(127, note));
};

export const parseRule = (ruleString: string): { birth: number[], survival: number[] } | null => {
  // Format: "23/3" or "23/36" -> Survival / Birth
  const parts = ruleString.split('/');
  if (parts.length !== 2) return null;

  const survivalStr = parts[0];
  const birthStr = parts[1];

  const survival = survivalStr.split('').map(Number).filter(n => !isNaN(n));
  const birth = birthStr.split('').map(Number).filter(n => !isNaN(n));

  return { survival, birth };
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const midiToNoteName = (midi: number): string => {
  const note = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
};

export const getColorHex = (theme: string): string => {
    switch(theme) {
        case 'purple': return '#a855f7';
        case 'green': return '#10b981';
        case 'orange': return '#f97316';
        case 'rose': return '#f43f5e';
        case 'mono': return '#ffffff';
        case 'cyan': default: return '#06b6d4';
    }
}