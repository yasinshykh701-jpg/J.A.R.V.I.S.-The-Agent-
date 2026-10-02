import React from 'react';
import { Bot, Sparkles, Zap, Trash2, Copy, Volume2, User } from 'lucide-react';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  model?: string;
  roleTitle?: string;
}

export interface ChatRoleConfig {
  id: string;
  title: string;
  model: 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
  badge: string;
  description: string;
  systemInstruction: string;
}

export const CHAT_ROLES: ChatRoleConfig[] = [
  {
    id: 'general_assistant',
    title: 'General Assistant',
    model: 'gemini-3.5-flash',
    badge: 'gemini-3.5-flash',
    description: 'Balanced multimodal intelligence for general tasks & inquiries',
    systemInstruction: 'You are a friendly, versatile, and highly articulate AI assistant powered by Gemini 3.5 Flash.'
  },
  {
    id: 'code_architect',
    title: 'Complex Reasoning & Architect',
    model: 'gemini-3.1-pro-preview',
    badge: 'gemini-3.1-pro-preview',
    description: 'Deep STEM reasoning, code architecture, algorithmic logic, and math',
    systemInstruction: 'You are a Senior Reasoning & Code Architect powered by Gemini 3.1 Pro Preview. Provide rigorous, deep, and structured explanations.'
  },
  {
    id: 'fast_assistant',
    title: 'Rapid High-Speed Assistant',
    model: 'gemini-3.1-flash-lite',
    badge: 'gemini-3.1-flash-lite',
    description: 'Low-latency, instantaneous, concise answers for fast workflows',
    systemInstruction: 'You are a Rapid High-Speed Assistant powered by Gemini 3.1 Flash Lite. Give direct, fast, and concise answers.'
  },
  {
    id: 'pandabot',
    title: 'Kung Fu Panda (Dragon Warrior)',
    model: 'gemini-3.5-flash',
    badge: 'Dragon Warrior',
    description: 'Po the Dragon Warrior • Martial arts wit, enthusiastic energy, and ancient wisdom',
    systemInstruction: 'You are Po the Dragon Warrior! You are energetic, wise, full of Kung Fu humor and noodle-fueled wisdom.'
  }
];

interface ChatHistoryViewProps {
  messages: ChatMessageItem[];
  currentRole: ChatRoleConfig;
  onSelectRole: (role: ChatRoleConfig) => void;
  onClearHistory: () => void;
  onSpeak?: (text: string) => void;
  isSubmitting?: boolean;
}

export function ChatHistoryView({
  messages,
  currentRole,
  onSelectRole,
  onClearHistory,
  onSpeak,
  isSubmitting
}: ChatHistoryViewProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 mb-2">
      {/* Role Switcher Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mr-1">
            Role:
          </span>
          {CHAT_ROLES.map((role) => {
            const isActive = currentRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role)}
                title={role.description}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 border cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {role.id === 'general_assistant' && <Sparkles size={11} className="text-cyan-300" />}
                {role.id === 'code_architect' && <Bot size={11} className="text-emerald-300" />}
                {role.id === 'fast_assistant' && <Zap size={11} className="text-amber-300" />}
                {role.id === 'pandabot' && <span className="text-xs">🐼</span>}
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-white/50 hover:text-red-300 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Trash2 size={11} /> Clear Thread
          </button>
        )}
      </div>

      {/* Scrollable Message Thread */}
      {messages.length > 0 && (
        <div className="w-full max-h-56 overflow-y-auto pr-1 space-y-2.5 rounded-xl p-2 bg-slate-950/40 border border-white/5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 px-1">
                {msg.role === 'user' ? (
                  <>
                    <span>You</span>
                    <User size={11} className="text-cyan-400" />
                  </>
                ) : (
                  <>
                    <Bot size={11} className="text-cyan-400" />
                    <span className="font-semibold text-cyan-300">
                      {msg.roleTitle || currentRole.title}
                    </span>
                    {msg.model && (
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-white/60 font-mono text-[9px]">
                        {msg.model}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 text-white border border-cyan-400/30 rounded-br-sm'
                    : 'bg-slate-900/90 text-white/90 border border-slate-700/50 rounded-bl-sm shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] text-white/40">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy size={10} />
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                    {onSpeak && (
                      <button
                        type="button"
                        onClick={() => onSpeak(msg.text)}
                        className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Volume2 size={10} /> Listen
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSubmitting && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/70 border border-cyan-400/30 text-cyan-300 text-xs animate-pulse">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Thinking with {currentRole.model}...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
