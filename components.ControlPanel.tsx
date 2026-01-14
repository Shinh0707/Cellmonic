import React, { useState } from 'react';
import { Settings, Library, Eye, Activity } from 'lucide-react';
import { MidiDevice, Preset, VisualSettings, InitMode } from './types';

// Import split panels
import SimulationPanel from './components.panels.SimulationPanel';
import GridPanel from './components.panels.GridPanel';
import VisualsPanel from './components.panels.VisualsPanel';
import LibraryPanel from './components.panels.LibraryPanel';
import { NavButton } from './components.SharedUI';

interface ControlPanelProps {
  hideUI: boolean; // VJ Mode
  isPlaying: boolean;
  togglePlay: () => void;
  reset: () => void;
  clear: () => void;
  ruleString: string;
  setRuleString: (s: string) => void;
  bpm: number;
  setBpm: (n: number) => void;
  antCount: number;
  setAntCount: (n: number) => void;
  midiDevices: MidiDevice[];
  selectedMidiId: string;
  setSelectedMidiId: (id: string) => void;
  gridSize: number;
  setGridSize: (n: number) => void;
  centerNote: number;
  setCenterNote: (n: number) => void;
  memos: Preset[];
  addMemo: (p: Preset) => void;
  deleteMemo: (index: number) => void;
  visualSettings: VisualSettings;
  setVisualSettings: (v: VisualSettings) => void;
  initMode: InitMode;
  setInitMode: (m: InitMode) => void;
  toggleHideUI: () => void;
}

type Tab = 'simulation' | 'grid' | 'visuals' | 'library';

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab | null>('simulation');

  // Toggle tab: if clicking active tab, close it (set null)
  const handleTabClick = (tab: Tab) => {
      setActiveTab(prev => prev === tab ? null : tab);
  };
  
  return (
    <div 
        className={`
            flex h-full bg-gray-900 border-r border-gray-800 shadow-2xl z-20 
            transition-all duration-500 ease-in-out
            ${props.hideUI ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
        style={{ width: props.hideUI ? 0 : 'auto' }} // Ensure it removes width from flex calculation when hidden
    >
      {/* Icon Navigation Bar */}
      <div className="w-16 flex flex-col items-center py-6 gap-6 border-r border-gray-800 bg-black/20 z-20 shrink-0">
        <NavButton 
            active={activeTab === 'simulation'} 
            onClick={() => handleTabClick('simulation')} 
            icon={<Activity size={24} />} 
            label="Sim" 
        />
        <NavButton 
            active={activeTab === 'grid'} 
            onClick={() => handleTabClick('grid')} 
            icon={<Settings size={24} />} 
            label="Grid" 
        />
        <NavButton 
            active={activeTab === 'visuals'} 
            onClick={() => handleTabClick('visuals')} 
            icon={<Eye size={24} />} 
            label="Look" 
        />
        <NavButton 
            active={activeTab === 'library'} 
            onClick={() => handleTabClick('library')} 
            icon={<Library size={24} />} 
            label="Lib" 
        />
      </div>

      {/* Panel Content (Collapsible) */}
      <div 
        className={`
            overflow-y-auto custom-scrollbar flex flex-col bg-gray-900
            transition-all duration-300 ease-in-out
            ${activeTab ? 'w-96 opacity-100 border-r border-gray-800' : 'w-0 opacity-0 border-none'}
        `}
      >
         <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10 whitespace-nowrap overflow-hidden">
            <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest">
                {activeTab === 'simulation' && "Simulation Control"}
                {activeTab === 'grid' && "Grid & MIDI Config"}
                {activeTab === 'visuals' && "Visual Appearance"}
                {activeTab === 'library' && "Library & AI"}
            </h2>
         </div>
         
         <div className="p-4 min-w-[200px]"> {/* Increased min-w to fit content comfortably */}
            {activeTab === 'simulation' && (
                <SimulationPanel 
                    isPlaying={props.isPlaying}
                    togglePlay={props.togglePlay}
                    reset={props.reset}
                    clear={props.clear}
                    bpm={props.bpm}
                    setBpm={props.setBpm}
                    ruleString={props.ruleString}
                    setRuleString={props.setRuleString}
                    antCount={props.antCount}
                    setAntCount={props.setAntCount}
                />
            )}
            
            {activeTab === 'grid' && (
                <GridPanel 
                    gridSize={props.gridSize}
                    setGridSize={props.setGridSize}
                    centerNote={props.centerNote}
                    setCenterNote={props.setCenterNote}
                    midiDevices={props.midiDevices}
                    selectedMidiId={props.selectedMidiId}
                    setSelectedMidiId={props.setSelectedMidiId}
                    initMode={props.initMode}
                    setInitMode={props.setInitMode}
                />
            )}
            
            {activeTab === 'visuals' && (
                <>
                <VisualsPanel 
                    visualSettings={props.visualSettings}
                    setVisualSettings={props.setVisualSettings}
                />
                <div className="mt-8 pt-4 border-t border-gray-800 text-center">
                    <button 
                        onClick={props.toggleHideUI}
                        className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors bg-gray-800 px-3 py-1 rounded-full"
                    >
                        Toggle VJ Mode (Hide UI) [Key: H]
                    </button>
                </div>
                </>
            )}
            
            {activeTab === 'library' && (
                <LibraryPanel 
                    memos={props.memos}
                    addMemo={props.addMemo}
                    deleteMemo={props.deleteMemo}
                    gridSize={props.gridSize}
                    centerNote={props.centerNote}
                    bpm={props.bpm}
                    antCount={props.antCount}
                    ruleString={props.ruleString}
                    setGridSize={props.setGridSize}
                    setCenterNote={props.setCenterNote}
                    setBpm={props.setBpm}
                    setAntCount={props.setAntCount}
                    setRuleString={props.setRuleString}
                />
            )}
         </div>
      </div>
    </div>
  );
};

export default ControlPanel;