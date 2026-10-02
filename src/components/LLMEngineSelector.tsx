import React from 'react';
import { Zap, Brain, Mic, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LLMEngineOption {
  id: string;
  name: string;
  shortName: string;
  description: string;
  folder: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

export const LLM_ENGINES: LLMEngineOption[] = [
  {
    id: 'unified',
    name: 'Unified Auto Engine',
    shortName: 'Unified Auto',
    description: 'Smart Router across all workspace engines',
    folder: 'Server Gateway',
    icon: Sparkles,
    color: 'from-amber-400 to-yellow-500 text-yellow-300 border-yellow-500/40',
    badge: 'AUTO',
  },
  {
    id: 'zevorix',
    name: 'Zevorix LLM Engine 1.0',
    shortName: 'Zevorix 1.0',
    description: 'HuggingFace Flan-T5 & Chroma Vector Store',
    folder: 'Zevorix LLM Engine 1.0',
    icon: Zap,
    color: 'from-cyan-500 to-blue-600 text-cyan-300 border-cyan-500/40',
    badge: 'LOCAL LLM',
  },
  {
    id: 'jarvis-rag',
    name: 'JARVIS RAG Engine',
    shortName: 'JARVIS RAG',
    description: 'LangChain QA Document Pipeline',
    folder: 'JARVIS/rag',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600 text-purple-300 border-purple-500/40',
    badge: 'RAG',
  },
  {
    id: 'voice-system',
    name: 'Voice System Control',
    shortName: 'Voice System',
    description: 'Desktop App Control & System Automation',
    folder: 'SYSTEM CONTROL ON VOICE',
    icon: Mic,
    color: 'from-emerald-500 to-teal-600 text-emerald-300 border-emerald-500/40',
    badge: 'VOICE / SYS',
  },
  {
    id: 'image-rag',
    name: 'Image RAG Pipeline',
    shortName: 'Image RAG',
    description: 'Prompt Engineer & Image RAG Generation',
    folder: 'image egeneration',
    icon: ImageIcon,
    color: 'from-pink-500 to-rose-600 text-pink-300 border-pink-500/40',
    badge: 'IMAGE RAG',
  },
];

interface LLMEngineSelectorProps {
  selectedEngine: string;
  onSelectEngine: (engineId: string) => void;
  className?: string;
  compact?: boolean;
}

export default function LLMEngineSelector({
  selectedEngine,
  onSelectEngine,
  className = '',
  compact = false,
}: LLMEngineSelectorProps) {
  const activeEngine = LLM_ENGINES.find((e) => e.id === selectedEngine) || LLM_ENGINES[0];

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar ${className}`}>
        {LLM_ENGINES.map((engine) => {
          const Icon = engine.icon;
          const isSelected = selectedEngine === engine.id;
          return (
            <button
              key={engine.id}
              onClick={() => onSelectEngine(engine.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                isSelected
                  ? `bg-gradient-to-r ${engine.color} shadow-lg shadow-black/40 border-white/30 text-white scale-105`
                  : 'bg-black/40 hover:bg-black/60 text-zinc-300 border-zinc-700/50 hover:border-zinc-500'
              }`}
              title={`${engine.name} (${engine.folder})`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
              <span>{engine.shortName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-3.5 border border-zinc-800 shadow-2xl ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Active Workspace LLM Model:
          </h3>
          <span className="text-xs font-extrabold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
            {activeEngine.name}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline-block">
          📁 {activeEngine.folder}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {LLM_ENGINES.map((engine) => {
          const Icon = engine.icon;
          const isSelected = selectedEngine === engine.id;
          return (
            <Button
              key={engine.id}
              variant="outline"
              onClick={() => onSelectEngine(engine.id)}
              className={`relative flex flex-col items-start p-3 h-auto justify-between rounded-xl transition-all duration-200 border text-left ${
                isSelected
                  ? `bg-gradient-to-br ${engine.color} border-white/40 shadow-lg shadow-black/50 text-white ring-1 ring-white/30 scale-[1.02]`
                  : 'bg-zinc-900/70 hover:bg-zinc-800/90 text-zinc-300 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#0a0f1a]/20' : 'bg-zinc-800'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                    {engine.badge}
                  </span>
                )}
              </div>
              <div className="w-full">
                <div className="font-bold text-xs truncate">{engine.shortName}</div>
                <div className="text-[10px] text-zinc-400 leading-tight line-clamp-1 opacity-80 mt-0.5">
                  {engine.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
