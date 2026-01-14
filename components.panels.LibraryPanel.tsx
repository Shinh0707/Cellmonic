import React, { useState } from 'react';
import { Library, GripHorizontal, Save, X } from 'lucide-react';
import { SectionLabel, PanelContainer } from './components.SharedUI';
import { Preset } from './types';

interface LibraryPanelProps {
    memos: Preset[];
    addMemo: (p: Preset) => void;
    deleteMemo: (index: number) => void;
    gridSize: number;
    centerNote: number;
    bpm: number;
    antCount: number;
    ruleString: string;
    setGridSize: (n: number) => void;
    setCenterNote: (n: number) => void;
    setBpm: (n: number) => void;
    setAntCount: (n: number) => void;
    setRuleString: (s: string) => void;
}

const PRESETS = [
  { name: "Drum Pad", size: 5, center: 62, bpm: 360, ants: 4, rule: "34678/3678" },
  { name: "Serious Synth", size: 7, center: 62, bpm: 240, ants: 3, rule: "876543210/765321" },
  { name: "Rythm Bass", size: 9, center: 70, bpm: 360, ants: 5, rule: "876543210/765321" },
  { name: "Chaos", size: 13, center: 73, bpm: 600, ants: 10, rule: "75310/7531" },
  { name: "Small Complex Rythm", size: 5, center: 62, bpm: 360, ants: 1, rule: "710/531" }
];

const LibraryPanel: React.FC<LibraryPanelProps> = ({ 
    memos, addMemo, deleteMemo, 
    gridSize, centerNote, bpm, antCount, ruleString,
    setGridSize, setCenterNote, setBpm, setAntCount, setRuleString
}) => {
    
    const [dragOverMemo, setDragOverMemo] = useState(false);

    const applyPreset = (p: Preset) => {
        setGridSize(p.size);
        setCenterNote(p.center);
        setBpm(p.bpm);
        setAntCount(p.ants);
        setRuleString(p.rule);
    };

    // D&D Logic
    const handleDragStart = (e: React.DragEvent) => {
        const currentConfig = JSON.stringify({
            size: gridSize,
            center: centerNote,
            bpm,
            ants: antCount,
            rule: ruleString
        });
        e.dataTransfer.setData("application/json", currentConfig);
        e.dataTransfer.effectAllowed = "copy";
    };
  
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverMemo(true);
    };
  
    const handleDragLeave = () => {
        setDragOverMemo(false);
    };
  
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverMemo(false);
        const data = e.dataTransfer.getData("application/json");
        if (data) {
            try {
                const config = JSON.parse(data);
                const name = prompt("Name this memo:", `Memo ${memos.length + 1}`);
                if (name) {
                    addMemo({ ...config, name });
                }
            } catch (err) {
                console.error("Drop failed", err);
            }
        }
    };

    return (
        <PanelContainer>
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <SectionLabel icon={Library} label="Presets & Memos" />
                    <div 
                        draggable 
                        onDragStart={handleDragStart}
                        className="cursor-grab active:cursor-grabbing bg-gray-800 border border-gray-600 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-gray-700"
                        title="Drag me to the dashed box below to save current state"
                    >
                        <GripHorizontal size={10} />
                        Current
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-1">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="bg-gray-800/50 hover:bg-cyan-900/50 border border-gray-800 hover:border-cyan-500/50 text-xs text-gray-400 hover:text-cyan-200 py-2 px-3 rounded text-left transition-all truncate"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>

                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-xl p-3 min-h-[80px] transition-colors
                            ${dragOverMemo ? 'border-green-500 bg-green-900/20' : 'border-gray-800 bg-black/20'}
                        `}
                    >
                        {memos.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-[10px] text-gray-600 gap-2">
                                <Save size={16} />
                                <span className="text-center">Drag "Current" chip here<br/>to save as Memo</span>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {memos.map((memo, idx) => (
                                    <div key={idx} className="flex gap-1 group">
                                        <button
                                            onClick={() => applyPreset(memo)}
                                            className="flex-1 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-900/50 text-xs text-amber-200/80 py-1.5 px-3 rounded text-left truncate"
                                        >
                                            {memo.name}
                                        </button>
                                        <button 
                                            onClick={() => deleteMemo(idx)}
                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-900/30 px-2 rounded transition-all"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        </PanelContainer>
    )
}

export default LibraryPanel;