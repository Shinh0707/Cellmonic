import React from 'react';
import { Play, Pause, RefreshCw, Trash2, Activity, Smartphone, Minus, Plus, Grid3X3 } from 'lucide-react';
import { SectionLabel, Separator, PanelContainer } from '../components.SharedUI';
import { parseRule } from '../utils.spiral';

interface SimulationPanelProps {
  isPlaying: boolean;
  togglePlay: () => void;
  reset: () => void;
  clear: () => void;
  bpm: number;
  setBpm: (n: number) => void;
  ruleString: string;
  setRuleString: (s: string) => void;
  antCount: number;
  setAntCount: (n: number) => void;
}

// --- Rule Editor Component (Local) ---
const RuleEditor = ({ ruleString, onChange }: { ruleString: string, onChange: (s: string) => void }) => {
    const parsed = parseRule(ruleString);
    const { survival, birth } = parsed || { survival: [], birth: [] };

    const toggle = (type: 'survival' | 'birth', num: number) => {
        let newS = [...survival];
        let newB = [...birth];
        
        if (type === 'survival') {
            if (newS.includes(num)) newS = newS.filter(n => n !== num);
            else newS.push(num);
        } else {
            if (newB.includes(num)) newB = newB.filter(n => n !== num);
            else newB.push(num);
        }
        
        newS.sort((a,b) => a-b);
        newB.sort((a,b) => a-b);
        
        onChange(`${newS.join('')}/${newB.join('')}`);
    };

    const neighbors = [0,1,2,3,4,5,6,7,8];

    return (
        <div className="bg-black/40 p-3 rounded-xl border border-gray-800">
             <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1 items-center">
                 
                 {/* Survival Row */}
                 <span className="text-[9px] uppercase text-green-400 font-bold tracking-tighter text-right pr-2">Survive</span>
                 {neighbors.map(n => (
                        <button 
                            key={`s-${n}`}
                            onClick={() => toggle('survival', n)}
                            className={`
                                h-6 flex items-center justify-center text-[10px] rounded-sm
                                transition-all
                                ${survival.includes(n) 
                                    ? 'bg-green-500 text-black font-bold shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                                    : 'bg-gray-800/50 text-gray-600 hover:bg-gray-700'}
                            `}
                        >
                            {n}
                        </button>
                 ))}

                 {/* Birth Row */}
                 <span className="text-[9px] uppercase text-cyan-400 font-bold tracking-tighter text-right pr-2">Birth</span>
                 {neighbors.map(n => (
                        <button 
                            key={`b-${n}`}
                            onClick={() => toggle('birth', n)}
                            className={`
                                h-6 flex items-center justify-center text-[10px] rounded-sm
                                transition-all
                                ${birth.includes(n) 
                                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                                    : 'bg-gray-800/50 text-gray-600 hover:bg-gray-700'}
                            `}
                        >
                            {n}
                        </button>
                 ))}

                 {/* Death Row (Auto - Visual Feedback) */}
                 <span className="text-[9px] uppercase text-rose-500 font-bold tracking-tighter text-right pr-2">Death</span>
                 {neighbors.map(n => {
                        const isDeath = !survival.includes(n);
                        return (
                        <div 
                            key={`d-${n}`}
                            className={`
                                h-5 flex items-center justify-center text-[9px] rounded-sm
                                ${isDeath 
                                    ? 'text-rose-700 font-bold bg-rose-950/20' 
                                    : 'text-transparent'}
                            `}
                        >
                            {isDeath ? n : ''}
                        </div>
                    )})}
             </div>
        </div>
    )
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
    isPlaying, togglePlay, reset, clear, bpm, setBpm, ruleString, setRuleString, antCount, setAntCount
}) => {
    return (
        <PanelContainer>
            <div className="flex gap-2 justify-center">
                <button
                onClick={togglePlay}
                className={`
                    flex items-center justify-center flex-1 h-12 rounded-lg transition-colors
                    ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-green-500 hover:bg-green-400 text-black'}
                    font-bold shadow-lg
                `}
                >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={reset} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white border border-gray-700" title="Randomize">
                    <RefreshCw size={20} />
                </button>
                <button onClick={clear} className="p-3 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-200 border border-red-900/50" title="Clear">
                    <Trash2 size={20} />
                </button>
            </div>

            <Separator />

            <div>
                <SectionLabel icon={Activity} label="Speed (BPM)" />
                <div className="flex gap-2 items-center">
                    <input 
                        type="range" 
                        min="30" 
                        max="999" 
                        value={bpm} 
                        onChange={(e) => setBpm(Number(e.target.value))}
                        className="flex-1 accent-cyan-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <input 
                        type="number"
                        value={bpm}
                        onChange={(e) => setBpm(Math.max(1, Number(e.target.value)))}
                        className="w-14 bg-black/50 border border-gray-700 rounded p-1 text-center text-xs focus:border-cyan-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <SectionLabel icon={Grid3X3} label="CA Rule" />
                <RuleEditor ruleString={ruleString} onChange={setRuleString} />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <SectionLabel icon={Smartphone} label="Ants" />
                    <span className="text-yellow-400 text-xs font-mono">{antCount}</span>
                </div>
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => setAntCount(Math.max(0, antCount - 1))}
                        className="bg-gray-800 hover:bg-gray-700 p-2 rounded border border-gray-700"
                    >
                        <Minus size={14} />
                    </button>
                    <input 
                        type="number" 
                        min="0"
                        value={antCount}
                        onChange={(e) => setAntCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="flex-1 bg-black/50 border border-gray-700 rounded p-2 text-center text-sm focus:border-cyan-500 outline-none"
                    />
                    <button 
                        onClick={() => setAntCount(antCount + 1)}
                        className="bg-gray-800 hover:bg-gray-700 p-2 rounded border border-gray-700"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        </PanelContainer>
    );
}

export default SimulationPanel;
