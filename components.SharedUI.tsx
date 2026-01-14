import React from 'react';

// Common UI Elements
export const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        title={label}
    >
        {icon}
    </button>
);

export const SectionLabel = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">
       <Icon size={12} />
       <span>{label}</span>
    </div>
);

export const Separator = () => <div className="h-px bg-gray-800 w-full" />;

export const PanelContainer = ({ children }: { children?: React.ReactNode }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
        {children}
    </div>
);