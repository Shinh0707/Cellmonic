import React, { useMemo } from 'react';
import { Ant, Grid as GridType, VisualSettings, RenderMode, ColorTheme } from './types';
import { mapGridToMidi, midiToNoteName, getColorHex } from './utils.spiral';

interface GridProps {
  grid: GridType;
  ants: Ant[];
  activeNotes: Set<number>;
  centerNote: number;
  visualSettings: VisualSettings;
  onCellClick: (x: number, y: number) => void;
}

const GridVisualizer: React.FC<GridProps> = ({ grid, ants, activeNotes, centerNote, visualSettings, onCellClick }) => {
  const size = grid.length;
  const { renderMode, tweaks, colorTheme } = visualSettings;

  // Pre-calculate note mapping
  const cells = useMemo(() => {
    const data = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const note = mapGridToMidi(x, y, size, centerNote);
        data.push({
          x,
          y,
          note,
          label: visualSettings.noteLabel === 'pitch' ? midiToNoteName(note) : note.toString()
        });
      }
    }
    return data;
  }, [size, centerNote, visualSettings.noteLabel]);

  // --- Theme Logic ---
  const getColor = (theme: ColorTheme, x: number, y: number): string => {
      if (theme === 'rainbow') {
          // Hue cycling based on position
          const hue = ((x + y) / (size * 2)) * 360;
          return `hsl(${hue}, 80%, 60%)`;
      }
      return getColorHex(theme);
  }

  // --- Styles ---

  const getContainerStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gap: `${tweaks.gridGap}px`,
        width: 'fit-content',
        maxWidth: '100%',
        aspectRatio: '1/1',
        transition: 'transform 0.5s ease',
      };

      // 3D Transforms
      if (tweaks.tilt > 0 || tweaks.rotation > 0 || renderMode === 'isometric') {
           const rotationZ = renderMode === 'isometric' ? 45 : tweaks.rotation;
           const rotationX = renderMode === 'isometric' ? 60 : tweaks.tilt;
           
           base.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateZ(${rotationZ}deg)`;
           base.transformStyle = 'preserve-3d';
      }

      if (renderMode === 'fluid') {
          base.filter = 'blur(8px) contrast(200%)';
          base.background = '#000'; // Needed for contrast trick
      }

      return base;
  };

  const getCellStyles = (isActive: boolean, isPlaying: boolean, x: number, y: number): React.CSSProperties => {
      const baseColor = getColor(colorTheme, x, y);
      const style: React.CSSProperties = { 
          // Use CSS variables for performance where possible, or inline styles
      };
      
      // DECAY LOGIC:
      // If active -> transition: none (instant on)
      // If inactive -> transition: background-color ${decayTime}ms (slow fade out)
      style.transition = isActive 
        ? 'none' 
        : `all ${tweaks.decayTime}ms ease-out, transform 0.2s`;

      // Shake/Jitter
      if (tweaks.shake > 0 && isActive) {
           const shakeX = (Math.random() - 0.5) * tweaks.shake;
           const shakeY = (Math.random() - 0.5) * tweaks.shake;
           style.transform = `translate(${shakeX}px, ${shakeY}px)`;
      }

      // --- Mode Specific Styling ---

      if (!isActive) {
          // Dead State
          style.backgroundColor = renderMode === 'terminal' || renderMode === 'char' ? 'transparent' : '#1f2937'; // gray-800
          
          if (renderMode === 'laser' || renderMode === 'neon') {
               style.backgroundColor = 'transparent';
               style.border = '1px solid #333';
          }
          if (renderMode === 'glitch') {
               style.backgroundColor = '#111';
          }
          if (renderMode === 'isometric') {
              style.boxShadow = '1px 1px 0px #111';
          }
          
          return style;
      }

      // Alive State (High Energy)
      
      // Base Active Color
      style.backgroundColor = baseColor;

      // GLOW / BLOOM
      if (tweaks.bloomStrength > 0) {
          const color = isPlaying ? '#fff' : baseColor;
          style.boxShadow = `0 0 ${tweaks.bloomStrength}px ${color}, 0 0 ${tweaks.bloomStrength * 2}px ${color}`;
          style.zIndex = 10;
      }

      // MODE OVERRIDES
      switch (renderMode) {
          case 'block':
              if (isPlaying) {
                  style.backgroundColor = '#fff';
                  style.transform = 'scale(1.1)';
              }
              break;

          case 'neon':
              style.backgroundColor = 'transparent';
              style.border = `2px solid ${isPlaying ? '#fff' : baseColor}`;
              style.boxShadow = `inset 0 0 ${tweaks.bloomStrength}px ${baseColor}, 0 0 ${tweaks.bloomStrength}px ${baseColor}`;
              break;

          case 'laser':
              style.backgroundColor = isPlaying ? '#fff' : 'transparent';
              style.border = `1px solid ${baseColor}`;
              // Crosshair effect via pseudo elements (implied simplicity here)
              break;

          case 'terminal':
              style.backgroundColor = `${baseColor}20`; // Low opacity bg
              style.color = isPlaying ? '#fff' : baseColor;
              style.fontWeight = 'bold';
              style.textShadow = `0 0 ${tweaks.bloomStrength}px ${baseColor}`;
              break;
              
          case 'char':
              style.backgroundColor = 'transparent';
              style.transform = isPlaying ? 'scale(1.5)' : 'scale(1.0)';
              break;

          case 'glitch':
              if (Math.random() < 0.3) {
                  style.backgroundColor = '#fff'; // Flash white
                  style.transform = `skew(${Math.random() * 20}deg)`;
              }
              // Simulate RGB shift with box-shadow
              style.boxShadow = `-2px 0 red, 2px 0 blue`;
              break;
          
          case 'isometric':
               style.transform = isPlaying ? 'translateZ(20px)' : 'translateZ(10px)';
               style.boxShadow = `-4px 4px 0px ${baseColor}66`; // Side shadow
               break;
      }
      
      // Fluid override (handled by container blur mostly)
      if (renderMode === 'fluid') {
          style.borderRadius = '50%';
          style.transform = isPlaying ? 'scale(1.5)' : 'scale(1.0)';
      }

      return style;
  };

  const getShapeClass = () => {
      if (renderMode === 'fluid') return 'rounded-full';
      if (renderMode === 'char' || renderMode === 'terminal') return ''; 
      switch(visualSettings.cellShape) {
          case 'circle': return 'rounded-full';
          case 'rounded': return 'rounded-lg';
          case 'square': default: return 'rounded-sm';
      }
  };

  return (
    <div 
      className={`relative p-4 rounded-xl transition-all duration-300 ease-in-out ${renderMode === 'terminal' ? 'font-mono' : ''}`}
      style={getContainerStyles()}
    >
      {cells.map((cell) => {
        const isAlive = grid[cell.y][cell.x];
        const antOnCell = ants.find(a => a.x === cell.x && a.y === cell.y);
        const isPlaying = activeNotes.has(cell.note);
        const style = getCellStyles(isAlive, isPlaying, cell.x, cell.y);
        
        // Label Visibility Logic
        const showLabel = size <= 30; // Auto-hide on very large grids
        const isLabelHiddenMode = visualSettings.noteLabel === 'none';

        return (
          <div
            key={`${cell.x}-${cell.y}`}
            onClick={() => onCellClick(cell.x, cell.y)}
            style={style}
            className={`
              relative 
              group
              flex items-center justify-center 
              cursor-pointer
              select-none
              ${size > 25 ? 'text-[6px]' : size > 15 ? 'text-[8px]' : 'text-[10px]'}
              ${getShapeClass()}
            `}
            title={`Note: ${cell.label}`}
          >
            {/* CONTENT RENDERING */}
            
            {/* Char Mode */}
            {renderMode === 'char' ? (
                <span className="text-sm md:text-base leading-none">
                    {isAlive ? (isPlaying ? '💥' : tweaks.aliveChar) : tweaks.deadChar}
                </span>
            ) : renderMode === 'terminal' ? (
                /* Terminal Mode */
                <span>{isAlive ? (Math.random() > 0.5 ? '1' : '0') : '.'}</span>
            ) : (
                /* Standard Label */
                 <span className={`
                     font-mono pointer-events-none transition-opacity duration-200
                     ${isAlive ? 'text-black font-bold' : 'text-white'}
                     ${!showLabel ? 'hidden' : ''}
                     ${isLabelHiddenMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-40'}
                 `}>
                    {cell.label}
                </span>
            )}

            {/* Ant Indicator */}
            {antOnCell && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                style={{
                     transform: renderMode === 'isometric' ? 'translateZ(30px)' : 'none'
                }}
              >
                 <div 
                    className={`${size > 25 ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4'}`}
                    style={{
                        backgroundColor: renderMode === 'terminal' ? '#fff' : antOnCell.color,
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                        transform: `rotate(${antOnCell.direction * 90}deg)`,
                        border: '1px solid black',
                        boxShadow: '0 0 5px white'
                    }}
                 />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GridVisualizer;