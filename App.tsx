import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_GRID_SIZE, DEFAULT_CENTER_NOTE, createEmptyGrid, mapGridToMidi, parseRule, getColorHex } from './utils.spiral';
import { Ant, Direction, Grid, MidiDevice, Preset, VisualSettings, InitMode } from './types';
import GridVisualizer from './components.GridVisualizer';
import ControlPanel from './components.ControlPanel';
import { midiService } from './services.midi';
import { dbService } from './services.db';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { HelpModal } from './components.HelpModal';

const DEFAULT_VISUALS: VisualSettings = {
  noteLabel: 'midi',
  cellShape: 'square',
  colorTheme: 'cyan',
  renderMode: 'block',
  tweaks: {
    bloomStrength: 10,
    decayTime: 300,
    gridGap: 1,
    tilt: 0,
    rotation: 0,
    aliveChar: '👾',
    deadChar: '・',
    shake: 0,
    screenFlash: false,
    zoom: 1.0,
    cameraFollow: false,
    cameraFollowAntId: 0
  }
};

const App: React.FC = () => {
  // --- State ---
  // Grid Settings
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [centerNote, setCenterNote] = useState(DEFAULT_CENTER_NOTE);
  const [initMode, setInitMode] = useState<InitMode>('auto');

  const [grid, setGrid] = useState<Grid>(createEmptyGrid(DEFAULT_GRID_SIZE));
  const [ants, setAnts] = useState<Ant[]>([]);

  // Simulation Control
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(240);
  const [ruleString, setRuleString] = useState("34678/3678");
  const [antCount, setAntCount] = useState(1);
  const [generation, setGeneration] = useState(0);

  // Memos / Presets
  const [memos, setMemos] = useState<Preset[]>([]);

  // Visual Settings
  const [visualSettings, setVisualSettings] = useState<VisualSettings>(DEFAULT_VISUALS);
  const [hideUI, setHideUI] = useState(false); // VJ Mode
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // MIDI
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [selectedMidiId, setSelectedMidiId] = useState("");
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  // Refs for loop and settings
  const gridRef = useRef(grid);
  const antsRef = useRef(ants);
  const activeNotesRef = useRef(activeNotes);
  const loopRef = useRef<number | null>(null);
  const initModeRef = useRef(initMode);

  // --- Helpers ---
  const wrap = useCallback((val: number) => (val + gridSize) % gridSize, [gridSize]);

  // --- Initialization ---

  // Update refs when state changes
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { antsRef.current = ants; }, [ants]);
  useEffect(() => { activeNotesRef.current = activeNotes; }, [activeNotes]);
  useEffect(() => { initModeRef.current = initMode; }, [initMode]);

  // Init MIDI
  useEffect(() => {
    midiService.initialize().then(() => {
      const outputs = midiService.getOutputs();
      setMidiDevices(outputs.map(o => ({ id: o.id, name: o.name || "Unknown Device" })));
      if (outputs.length > 0) setSelectedMidiId(outputs[0].id);
    });
  }, []);

  // Init DB and Load Memos
  useEffect(() => {
    dbService.initDB()
      .then(() => dbService.getAllMemos())
      .then(setMemos)
      .catch(err => console.error("Failed to load memos", err));
  }, []);

  useEffect(() => {
    if (selectedMidiId) midiService.setOutput(selectedMidiId);
  }, [selectedMidiId]);

  // Keyboard Shortcuts (VJ Mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setHideUI(prev => !prev);
      }
      if (e.code === 'Space') {
        // Optional: Toggle play with space, but might conflict with text inputs if focused
        // setIsPlaying(p => !p); 
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Grid Randomly
  const randomize = useCallback(() => {
    // Panic: Explicitly turn off all currently active notes
    activeNotesRef.current.forEach(note => midiService.noteOff(note));
    midiService.allNotesOff();
    setActiveNotes(new Set());

    const newGrid = createEmptyGrid(gridSize);
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        newGrid[y][x] = Math.random() > 0.8; // Sparse
      }
    }
    setGrid(newGrid);
    setGeneration(0);

    // Reset ants to center
    const cx = Math.floor(gridSize / 2);
    const cy = Math.floor(gridSize / 2);
    const colors = ['#facc15', '#f472b6', '#4ade80', '#c084fc', '#fb923c'];

    const newAnts: Ant[] = [];
    for (let i = 0; i < antCount; i++) {
      newAnts.push({
        id: i,
        x: cx,
        y: cy,
        direction: Direction.UP,
        color: colors[i % colors.length]
      });
    }
    setAnts(newAnts);

  }, [gridSize, antCount]);

  // Handle Grid Size Change
  useEffect(() => {
    // Check ref for current mode to avoid useEffect triggering on mode toggle
    if (initModeRef.current === 'auto') {
      randomize();
    } else {
      // Manual Mode: Clear grid

      // Panic: Explicitly turn off all currently active notes
      activeNotesRef.current.forEach(note => midiService.noteOff(note));
      midiService.allNotesOff();
      setActiveNotes(new Set());

      setGrid(createEmptyGrid(gridSize));
      setGeneration(0);

      // Reset ants to center
      const cx = Math.floor(gridSize / 2);
      const cy = Math.floor(gridSize / 2);
      const colors = ['#facc15', '#f472b6', '#4ade80', '#c084fc', '#fb923c'];
      const newAnts: Ant[] = [];
      for (let i = 0; i < antCount; i++) {
        newAnts.push({
          id: i,
          x: cx,
          y: cy,
          direction: Direction.UP,
          color: colors[i % colors.length]
        });
      }
      setAnts(newAnts);
    }
  }, [gridSize, randomize, antCount]); // randomize depends on gridSize

  // --- Interaction ---
  const handleCellClick = (x: number, y: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[y][x] = !newGrid[y][x];
    setGrid(newGrid);

    // Immediate Audio Feedback
    if (newGrid[y][x]) {
      const note = mapGridToMidi(x, y, gridSize, centerNote);
      midiService.noteOn(note, 90);
      // Short note
      setTimeout(() => midiService.noteOff(note), 150);
    }
  };

  const handleGridSizeChange = (n: number) => {
    let newSize = n;
    if (newSize < 3) newSize = 3;
    setGridSize(newSize);
  };

  const handleCenterNoteChange = (n: number) => {
    const val = Math.max(0, n);

    // Panic: Turn off all currently active notes as mapping shifts
    activeNotesRef.current.forEach(note => midiService.noteOff(note));
    midiService.allNotesOff();
    setActiveNotes(new Set());

    setCenterNote(val);
  };

  // --- Simulation Engine ---

  const step = useCallback(() => {
    const currentGrid = gridRef.current;
    const currentAnts = antsRef.current;
    const prevNotes = activeNotesRef.current;
    const size = currentGrid.length;

    const rule = parseRule(ruleString) || { birth: [3], survival: [2, 3] };

    const nextGrid = createEmptyGrid(size);
    const nextAnts = currentAnts.map(ant => ({ ...ant }));

    // 1. Game of Life Step
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = (y + dy + size) % size;
            const nx = (x + dx + size) % size;
            if (currentGrid[ny][nx]) neighbors++;
          }
        }

        const isAlive = currentGrid[y][x];
        if (isAlive) {
          nextGrid[y][x] = rule.survival.includes(neighbors);
        } else {
          nextGrid[y][x] = rule.birth.includes(neighbors);
        }
      }
    }

    // 2. Langton's Ant Step
    nextAnts.forEach(ant => {
      if (ant.y >= size || ant.x >= size) {
        ant.x = size > 0 ? Math.floor(size / 2) : 0;
        ant.y = size > 0 ? Math.floor(size / 2) : 0;
      }

      const cellState = nextGrid[ant.y][ant.x];

      if (!cellState) {
        ant.direction = (ant.direction + 1) % 4;
        nextGrid[ant.y][ant.x] = true;
      } else {
        ant.direction = (ant.direction + 3) % 4;
        nextGrid[ant.y][ant.x] = false;
      }

      switch (ant.direction) {
        case Direction.UP: ant.y = (ant.y - 1 + size) % size; break;
        case Direction.RIGHT: ant.x = (ant.x + 1) % size; break;
        case Direction.DOWN: ant.y = (ant.y + 1) % size; break;
        case Direction.LEFT: ant.x = (ant.x - 1 + size) % size; break;
      }
    });

    // 3. MIDI Triggering
    const newActiveNotes = new Set<number>();

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (nextGrid[y][x]) {
          const note = mapGridToMidi(x, y, size, centerNote);
          newActiveNotes.add(note);

          if (!prevNotes.has(note)) {
            midiService.noteOn(note, 80);
          }
        }
      }
    }

    prevNotes.forEach(note => {
      if (!newActiveNotes.has(note)) {
        midiService.noteOff(note);
      }
    });

    setGrid(nextGrid);
    setAnts(nextAnts);
    setActiveNotes(newActiveNotes);
    setGeneration(g => g + 1);

  }, [ruleString, centerNote]);

  // --- Loop Management ---

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 60000 / bpm;
      loopRef.current = window.setInterval(step, intervalMs);
    } else {
      if (loopRef.current) clearInterval(loopRef.current);

      // Full Panic Mode: Send Note Off to ALL 128 keys to prevent stuck notes
      for (let i = 0; i < 128; i++) {
        midiService.noteOff(i);
      }
      midiService.allNotesOff(); // CC 123

      setActiveNotes(new Set());
    }
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isPlaying, bpm, step]);

  useEffect(() => {
    return () => {
      midiService.allNotesOff();
    }
  }, []);

  const handleClear = () => {
    setGrid(createEmptyGrid(gridSize));
    setGeneration(0);
    activeNotesRef.current.forEach(note => midiService.noteOff(note));
    midiService.allNotesOff();
    setActiveNotes(new Set());
  };

  const handleAddMemo = (preset: Preset) => {
    dbService.addMemo(preset).then(id => {
      setMemos(prev => [...prev, { ...preset, id }]);
    }).catch(err => console.error("Failed to save memo", err));
  };

  const handleDeleteMemo = (index: number) => {
    const memoToDelete = memos[index];
    if (memoToDelete.id !== undefined) {
      dbService.deleteMemo(memoToDelete.id)
        .then(() => {
          setMemos(prev => prev.filter((_, i) => i !== index));
        })
        .catch(err => console.error("Failed to delete memo", err));
    } else {
      // Fallback for non-persisted memos (shouldn't happen often)
      setMemos(prev => prev.filter((_, i) => i !== index));
    }
  };

  // --- Visuals Logic ---
  const handleVisualReset = () => {
    setVisualSettings(DEFAULT_VISUALS);
  }

  // Calculate Flash Effect
  const flashColor = visualSettings.colorTheme === 'rainbow' ? '#ffffff' : getColorHex(visualSettings.colorTheme);
  const flashOpacity = (visualSettings.tweaks.screenFlash && activeNotes.size > 0)
    ? Math.min(activeNotes.size * 0.15, 0.4)
    : 0;

  // View Transformation Logic
  const { zoom, cameraFollow, cameraFollowAntId } = visualSettings.tweaks;

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Determine delta
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(visualSettings.tweaks.zoom + delta, 0.1), 5.0);

    setVisualSettings(prev => ({
      ...prev,
      tweaks: { ...prev.tweaks, zoom: newZoom }
    }));
  };

  // Cycle Camera Ant
  const cycleCameraAnt = (direction: number) => {
    if (ants.length === 0) return;
    setVisualSettings(prev => {
      const currentId = prev.tweaks.cameraFollowAntId || 0;
      let nextIndex = ants.findIndex(a => a.id === currentId);

      if (nextIndex === -1) nextIndex = 0;
      else nextIndex = (nextIndex + direction + ants.length) % ants.length;

      return {
        ...prev,
        tweaks: { ...prev.tweaks, cameraFollowAntId: ants[nextIndex].id }
      };
    });
  };

  // Calculate Translate offset if camera follow is active
  let translateX = 0;
  let translateY = 0;
  let targetAnt = ants.length > 0 ? ants[0] : null;

  if (cameraFollow && ants.length > 0) {
    // Find the specific ant to follow
    const foundAnt = ants.find(a => a.id === cameraFollowAntId);
    targetAnt = foundAnt || ants[0]; // Fallback to first ant if ID not found

    const centerX = gridSize / 2;
    const centerY = gridSize / 2;

    translateX = ((centerX - targetAnt.x - 0.5) / gridSize) * 100;
    translateY = ((centerY - targetAnt.y - 0.5) / gridSize) * 100;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050505] text-gray-200 font-sans selection:bg-cyan-500/30">

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Global Screen Flash Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-75"
        style={{
          backgroundColor: flashColor,
          opacity: flashOpacity
        }}
      />

      {/* Sidebar (Fixed Left) */}
      <ControlPanel
        hideUI={hideUI}
        isPlaying={isPlaying}
        togglePlay={() => setIsPlaying(!isPlaying)}
        reset={randomize}
        clear={handleClear}
        ruleString={ruleString}
        setRuleString={setRuleString}
        bpm={bpm}
        setBpm={setBpm}
        antCount={antCount}
        setAntCount={setAntCount}
        midiDevices={midiDevices}
        selectedMidiId={selectedMidiId}
        setSelectedMidiId={setSelectedMidiId}
        gridSize={gridSize}
        setGridSize={handleGridSizeChange}
        centerNote={centerNote}
        setCenterNote={handleCenterNoteChange}
        memos={memos}
        addMemo={handleAddMemo}
        deleteMemo={handleDeleteMemo}
        visualSettings={visualSettings}
        setVisualSettings={setVisualSettings}
        initMode={initMode}
        setInitMode={setInitMode}
        toggleHideUI={() => setHideUI(!hideUI)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/30 via-[#050505] to-[#050505] z-10 overflow-hidden">

        {/* Header Overlay - Hidden in VJ Mode */}
        <header
          className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-10 transition-opacity duration-500 ${hideUI ? 'opacity-0' : 'opacity-100'}`}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 opacity-90 drop-shadow-sm">
              Cellmonic
            </h1>
            <p className="text-xs text-gray-600 font-mono mt-1">
              {gridSize}x{gridSize} Spiral Grid • {antCount} Ants
            </p>
          </div>

          <div className="pointer-events-auto">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="bg-gray-900/80 hover:bg-gray-800 backdrop-blur border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-cyan-500 hover:text-white transition-colors"
              title="Help & Guide"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        {/* Visualization Canvas */}
        <div
          className="flex-1 flex items-center justify-center p-8 overflow-hidden relative cursor-zoom-in active:cursor-grabbing"
          onWheel={handleWheel}
        >
          <div
            className="transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `scale(${zoom}) translate(${translateX}%, ${translateY}%)`
            }}
          >
            <GridVisualizer
              grid={grid}
              ants={ants}
              activeNotes={activeNotes}
              centerNote={centerNote}
              visualSettings={visualSettings}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Camera Follow Indicator & Controls - Hidden in VJ Mode */}
          {cameraFollow && targetAnt && (
            <div className={`absolute bottom-6 right-6 flex items-center gap-2 pointer-events-auto animate-pulse-slow transition-opacity duration-500 ${hideUI ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center gap-1 bg-black/80 backdrop-blur px-2 py-1 rounded border border-cyan-900 shadow-lg text-xs text-cyan-500 font-mono">
                <button
                  onClick={() => cycleCameraAnt(-1)}
                  className="p-1 hover:text-white hover:bg-cyan-900/50 rounded transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="min-w-[120px] text-center flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC (Ant #{targetAnt.id})
                </span>

                <button
                  onClick={() => cycleCameraAnt(1)}
                  className="p-1 hover:text-white hover:bg-cyan-900/50 rounded transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default App;