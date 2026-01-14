import React from 'react';
import { Eye, Palette, Grid3X3, Layers, Type, Zap, Monitor, Sparkles, Box, Settings, Video, ZoomIn, RotateCcw, Activity } from 'lucide-react';
import { SectionLabel, PanelContainer, Separator } from './components.SharedUI';
import { VisualSettings } from './types';
import { getColorHex } from './utils.spiral';

interface VisualsPanelProps {
  visualSettings: VisualSettings;
  setVisualSettings: (v: VisualSettings) => void;
}

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

const VisualsPanel: React.FC<VisualsPanelProps> = ({ visualSettings, setVisualSettings }) => {
    
    // Helper to update partial settings
    const update = (partial: Partial<VisualSettings>) => setVisualSettings({ ...visualSettings, ...partial });
    const tweak = (key: keyof VisualSettings['tweaks'], value: any) => {
        setVisualSettings({
            ...visualSettings,
            tweaks: { ...visualSettings.tweaks, [key]: value }
        });
    };
    
    const handleReset = () => {
        if(confirm("Reset visual settings to default?")) {
            setVisualSettings(DEFAULT_VISUALS);
        }
    };

    return (
        <PanelContainer>
            {/* Header / Reset */}
            <div className="flex justify-between items-center">
                 <SectionLabel icon={Monitor} label="Render Mode (VJ)" />
                 <button 
                    onClick={handleReset}
                    className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    title="Reset to default clean look"
                 >
                     <RotateCcw size={10} /> Reset
                 </button>
            </div>

            {/* RENDER MODE (VJ FEATURE) */}
            <div>
                 <div className="grid grid-cols-4 gap-1 text-[10px] mb-4">
                    <ModeButton mode="block" current={visualSettings.renderMode} icon={<Grid3X3 size={10}/>} onClick={() => update({ renderMode: 'block' })} />
                    <ModeButton mode="fluid" current={visualSettings.renderMode} icon={<Activity size={10}/>} onClick={() => update({ renderMode: 'fluid' })} />
                    <ModeButton mode="neon" current={visualSettings.renderMode} icon={<Sparkles size={10}/>} onClick={() => update({ renderMode: 'neon' })} />
                    <ModeButton mode="laser" current={visualSettings.renderMode} icon={<Layers size={10}/>} onClick={() => update({ renderMode: 'laser' })} />
                    
                    <ModeButton mode="isometric" current={visualSettings.renderMode} icon={<Box size={10}/>} onClick={() => update({ renderMode: 'isometric' })} />
                    <ModeButton mode="terminal" current={visualSettings.renderMode} icon={<Type size={10}/>} onClick={() => update({ renderMode: 'terminal' })} />
                    <ModeButton mode="glitch" current={visualSettings.renderMode} icon={<Zap size={10}/>} onClick={() => update({ renderMode: 'glitch' })} />
                    <ModeButton mode="char" current={visualSettings.renderMode} icon={<span>😀</span>} onClick={() => update({ renderMode: 'char' })} />
                 </div>
            </div>

            <Separator />

             {/* CAMERA & VIEW */}
             <div>
                <SectionLabel icon={Video} label="Camera & View" />
                <div className="space-y-3">
                    
                    {/* Camera Follow Toggle */}
                    <div className="flex justify-between items-center text-[10px] text-gray-400 bg-gray-800/50 p-2 rounded">
                        <span className="flex items-center gap-1">
                            <Video size={10} className={visualSettings.tweaks.cameraFollow ? 'text-green-400' : 'text-gray-600'}/>
                            Follow Ant
                        </span>
                        <button 
                            onClick={() => tweak('cameraFollow', !visualSettings.tweaks.cameraFollow)}
                            className={`w-8 h-4 rounded-full relative transition-colors ${visualSettings.tweaks.cameraFollow ? 'bg-cyan-600' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${visualSettings.tweaks.cameraFollow ? 'left-4.5' : 'left-0.5'}`} style={{ left: visualSettings.tweaks.cameraFollow ? '18px' : '2px'}}/>
                        </button>
                    </div>

                    {/* Zoom Slider */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span className="flex items-center gap-1"><ZoomIn size={10}/> Zoom</span>
                            <span>{visualSettings.tweaks.zoom.toFixed(1)}x</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-gray-600">0.1x</span>
                            <input 
                                type="range" min="0.1" max="5.0" step="0.1"
                                value={visualSettings.tweaks.zoom}
                                onChange={(e) => tweak('zoom', Number(e.target.value))}
                                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <span className="text-[9px] text-gray-600">5.0x</span>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* FINE TUNING SLIDERS */}
            <div>
                <SectionLabel icon={SettingsSlider} label="Effects & Physics" />
                <div className="space-y-3">
                    {/* Screen Flash Toggle */}
                    <div className="flex justify-between items-center text-[10px] text-gray-400 bg-gray-800/50 p-2 rounded">
                        <span className="flex items-center gap-1">
                            <Zap size={10} className={visualSettings.tweaks.screenFlash ? 'text-yellow-400' : 'text-gray-600'}/>
                            Screen Flash (Sync)
                        </span>
                        <button 
                            onClick={() => tweak('screenFlash', !visualSettings.tweaks.screenFlash)}
                            className={`w-8 h-4 rounded-full relative transition-colors ${visualSettings.tweaks.screenFlash ? 'bg-cyan-600' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${visualSettings.tweaks.screenFlash ? 'left-4.5' : 'left-0.5'}`} style={{ left: visualSettings.tweaks.screenFlash ? '18px' : '2px'}}/>
                        </button>
                    </div>

                    {/* Decay / Trail */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Trail / Decay</span>
                            <span>{visualSettings.tweaks.decayTime}ms</span>
                        </div>
                        <input 
                            type="range" min="0" max="2000" step="50"
                            value={visualSettings.tweaks.decayTime}
                            onChange={(e) => tweak('decayTime', Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Bloom Strength */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Glow Strength</span>
                            <span>{visualSettings.tweaks.bloomStrength}px</span>
                        </div>
                        <input 
                            type="range" min="0" max="50" step="1"
                            value={visualSettings.tweaks.bloomStrength}
                            onChange={(e) => tweak('bloomStrength', Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                     {/* Grid Gap */}
                     <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Grid Spacing</span>
                            <span>{visualSettings.tweaks.gridGap}px</span>
                        </div>
                        <input 
                            type="range" min="0" max="10" step="1"
                            value={visualSettings.tweaks.gridGap}
                            onChange={(e) => tweak('gridGap', Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Shake / Glitchiness */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Shake / Jitter</span>
                            <span>{visualSettings.tweaks.shake}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" step="1"
                            value={visualSettings.tweaks.shake}
                            onChange={(e) => tweak('shake', Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* 3D Tilt (Only visible if applicable, but keep layout consistent) */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>3D Tilt / Perspective</span>
                            <span>{visualSettings.tweaks.tilt}°</span>
                        </div>
                        <input 
                            type="range" min="0" max="60" step="1"
                            value={visualSettings.tweaks.tilt}
                            onChange={(e) => tweak('tilt', Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Rotation</span>
                            <span>{visualSettings.tweaks.rotation}°</span>
                        </div>
                        <input 
                            type="range" min="0" max="360" step="5"
                            value={visualSettings.tweaks.rotation}
                            onChange={(e) => tweak('rotation', Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Char Mode Inputs */}
                    {visualSettings.renderMode === 'char' && (
                         <div className="flex gap-2 pt-2">
                             <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-gray-500 uppercase">Alive Char</label>
                                <input 
                                    type="text" value={visualSettings.tweaks.aliveChar} 
                                    onChange={(e) => tweak('aliveChar', e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded p-1 text-center text-xs"
                                />
                             </div>
                             <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-gray-500 uppercase">Dead Char</label>
                                <input 
                                    type="text" value={visualSettings.tweaks.deadChar} 
                                    onChange={(e) => tweak('deadChar', e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded p-1 text-center text-xs"
                                />
                             </div>
                         </div>
                    )}
                </div>
            </div>

            <Separator />

            <div>
                <SectionLabel icon={Palette} label="Color Theme" />
                <div className="grid grid-cols-7 gap-1 bg-gray-800/50 p-2 rounded-xl border border-gray-700">
                    {['cyan', 'purple', 'green', 'orange', 'rose', 'mono', 'rainbow'].map((c) => (
                        <button
                            key={c}
                            onClick={() => update({ colorTheme: c as any })}
                            className={`
                                w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center 
                                ${visualSettings.colorTheme === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}
                                ${c === 'rainbow' ? 'bg-gradient-to-br from-red-500 via-green-500 to-blue-500' : ''}
                            `}
                            style={{ backgroundColor: c !== 'rainbow' ? getColorHex(c as any) : undefined }}
                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                        >
                            {visualSettings.colorTheme === c && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
                 <div>
                    <SectionLabel icon={Grid3X3} label="Cell Shape" />
                    <div className="flex flex-col gap-1 text-xs">
                        {['square', 'circle', 'rounded'].map((s) => (
                             <button 
                                key={s}
                                onClick={() => update({ cellShape: s as any })}
                                className={`text-left px-2 py-1.5 rounded transition-colors ${visualSettings.cellShape === s ? 'bg-gray-700 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <SectionLabel icon={Eye} label="Labels" />
                    <div className="flex flex-col gap-1 text-xs">
                        {['midi', 'pitch', 'none'].map((l) => (
                            <button 
                                key={l}
                                onClick={() => update({ noteLabel: l as any })}
                                className={`text-left px-2 py-1.5 rounded transition-colors ${visualSettings.noteLabel === l ? 'bg-gray-700 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </PanelContainer>
    )
}

// Helpers
const ModeButton = ({ mode, current, icon, onClick }: { mode: string, current: string, icon: React.ReactNode, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`
            py-2 px-1 rounded border transition-all flex flex-col items-center justify-center gap-1
            ${current === mode 
                ? 'bg-cyan-900/40 border-cyan-500 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}
        `}
        title={mode.toUpperCase()}
    >
        {icon}
        <span className="text-[9px] uppercase font-bold">{mode}</span>
    </button>
);

const SettingsSlider = () => <Settings size={12} />;

export default VisualsPanel;