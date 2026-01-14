import React from 'react';
import { Settings, Grid3X3, Music, Zap } from 'lucide-react';
import { SectionLabel, Separator, PanelContainer } from './components.SharedUI';
import { MidiDevice, InitMode } from './types';

interface GridPanelProps {
  gridSize: number;
  setGridSize: (n: number) => void;
  centerNote: number;
  setCenterNote: (n: number) => void;
  midiDevices: MidiDevice[];
  selectedMidiId: string;
  setSelectedMidiId: (id: string) => void;
  initMode: InitMode;
  setInitMode: (m: InitMode) => void;
}

const GridPanel: React.FC<GridPanelProps> = ({
    gridSize, setGridSize, centerNote, setCenterNote, midiDevices, selectedMidiId, setSelectedMidiId, initMode, setInitMode
}) => {
    return (
        <PanelContainer>
             <div>
                <SectionLabel icon={Grid3X3} label="Grid Initialization" />
                <div className="flex bg-gray-800 rounded p-1 gap-1">
                    <button 
                        onClick={() => setInitMode('auto')}
                        className={`flex-1 py-1.5 text-xs rounded transition-all flex items-center justify-center gap-1 ${initMode === 'auto' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Zap size={10} /> Auto (Random)
                    </button>
                    <button 
                        onClick={() => setInitMode('manual')}
                        className={`flex-1 py-1.5 text-xs rounded transition-all flex items-center justify-center gap-1 ${initMode === 'manual' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Settings size={10} /> Manual (Empty)
                    </button>
                </div>
                <p className="text-[9px] text-gray-600 mt-1 mb-3">
                    Controls whether grid randomizes or clears when resizing.
                </p>

                <SectionLabel icon={Grid3X3} label="Dimensions" />
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 block">Grid Size (NxN)</label>
                        <input 
                            type="number" 
                            min="3" 
                            value={gridSize}
                            onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (!isNaN(val)) setGridSize(val);
                            }}
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-center text-sm focus:border-cyan-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 block">Center Note (MIDI)</label>
                        <input 
                            type="number" 
                            min="0" 
                            value={centerNote}
                            onChange={(e) => setCenterNote(Number(e.target.value))}
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-center text-sm focus:border-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <SectionLabel icon={Music} label="MIDI Output" />
                <select 
                    value={selectedMidiId}
                    onChange={(e) => setSelectedMidiId(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded p-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
                >
                    <option value="">-- Web Audio (Default) --</option>
                    {midiDevices.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">
                    Connect a MIDI device or use virtual ports to control DAWs.
                </p>
            </div>
        </PanelContainer>
    )
}

export default GridPanel;