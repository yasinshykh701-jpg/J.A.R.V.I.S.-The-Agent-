/**
 * ModelSelector — AI model picker dropdown
 *
 * Matches the UI in the uploaded reference image:
 * "Access the top AI models" list with icons, names, badges, and lock icons.
 *
 * All models are FREE (no lock) because Zevorix is local.
 *
 * Usage:
 *   <ModelSelector
 *     selected={model}
 *     onChange={setModel}
 *   />
 *
 * Or inline (no popup):
 *   <ModelSelector selected={model} onChange={setModel} inline />
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Zap, Brain, Mic, Sparkles, Globe, Bot, Check } from 'lucide-react';
import { type ZevorixModel, ZEVORIX_MODELS, zevorix } from '@/services/zevorixService';

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  '⚡': Zap,
  '✨': Sparkles,
  '🧠': Brain,
  '🎙️': Mic,
  '✦': Globe,
  '🤗': Bot,
};

// ── Status dot ────────────────────────────────────────────────────────────────
function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
        online ? 'bg-emerald-400' : 'bg-zinc-600'
      }`}
    />
  );
}

// ── Single model row ──────────────────────────────────────────────────────────
function ModelRow({
  model,
  selected,
  online,
  onSelect,
}: {
  model: (typeof ZEVORIX_MODELS)[number];
  selected: boolean;
  online: boolean;
  onSelect: () => void;
}) {
  const Icon = ICON_MAP[model.icon] ?? Zap;

  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group"
      style={{
        background: selected
          ? `${model.color}14`
          : 'transparent',
        border: selected
          ? `1px solid ${model.color}30`
          : '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!selected)
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
      }}
      onMouseLeave={(e) => {
        if (!selected)
          (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
    >
      {/* Model icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${model.color}18`, border: `1px solid ${model.color}30` }}
      >
        <Icon className="w-4 h-4" style={{ color: model.color }} />
      </div>

      {/* Name + subtitle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-white/90 truncate">
            {model.name}
          </span>
          {model.local && (
            <span
              className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0"
              style={{ background: `${model.color}18`, color: model.color }}
            >
              {model.badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StatusDot online={online} />
          <span className="text-[10px] text-white/40 truncate">{model.subtitle}</span>
        </div>
      </div>

      {/* Selected check / free badge */}
      {selected ? (
        <Check className="w-4 h-4 shrink-0" style={{ color: model.color }} />
      ) : (
        <span className="text-[9px] text-white/30 font-semibold shrink-0">FREE</span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  selected: ZevorixModel;
  onChange: (model: ZevorixModel) => void;
  /** Render as an always-visible list instead of a dropdown */
  inline?: boolean;
  /** Compact trigger button (default: full pill) */
  compact?: boolean;
  className?: string;
}

export default function ModelSelector({
  selected,
  onChange,
  inline = false,
  compact = false,
  className = '',
}: ModelSelectorProps) {
  const [open, setOpen]           = useState(false);
  const [statuses, setStatuses]   = useState<Record<string, boolean>>({});
  const dropdownRef               = useRef<HTMLDivElement>(null);
  const activeMeta                = zevorix.getModelMeta(selected);
  const ActiveIcon                = ICON_MAP[activeMeta.icon] ?? Zap;

  // Check backend status once on mount
  useEffect(() => {
    zevorix.status().then((s) => {
      setStatuses({
        zevorix:        s.zevorixApi,
        'jarvis-unified': s.jarvisApi,
        'jarvis-rag':   s.jarvisApi,
        'voice-system': s.jarvisApi,
        gemini:         true,
        'hf-flan':      true,
        'hf-dialogpt':  true,
      });
    });
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const list = (
    <div
      className="space-y-0.5 p-2"
      style={{ minWidth: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-1">
        <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
          Access AI Models
        </span>
        <Zap className="w-3 h-3 text-[#00c8ff60]" />
      </div>

      {ZEVORIX_MODELS.map((m) => (
        <ModelRow
          key={m.id}
          model={m}
          selected={selected === m.id}
          online={statuses[m.id] ?? false}
          onSelect={() => {
            onChange(m.id as ZevorixModel);
            setOpen(false);
          }}
        />
      ))}
    </div>
  );

  // ── Inline mode: just render the list ──────────────────────────────────────
  if (inline) {
    return (
      <div
        className={`rounded-2xl overflow-hidden ${className}`}
        style={{ background: 'rgba(0,8,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {list}
      </div>
    );
  }

  // ── Dropdown mode ──────────────────────────────────────────────────────────
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full transition-all ${
          compact
            ? 'px-3 py-1.5'
            : 'px-4 py-2'
        }`}
        style={{
          background: `${activeMeta.color}12`,
          border:     `1px solid ${activeMeta.color}35`,
          boxShadow:  open ? `0 0 16px ${activeMeta.color}25` : 'none',
        }}
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${activeMeta.color}20` }}
        >
          <ActiveIcon className="w-3 h-3" style={{ color: activeMeta.color }} />
        </div>
        <span
          className={`font-bold ${compact ? 'text-[10px]' : 'text-xs'}`}
          style={{ color: activeMeta.color }}
        >
          {compact ? activeMeta.badge : activeMeta.name}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: activeMeta.color }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 bottom-full mb-2 right-0 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(4,8,18,0.97)',
            border:     '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow:  '0 -8px 40px rgba(0,0,0,0.6)',
            minWidth:   300,
          }}
        >
          {list}
        </div>
      )}
    </div>
  );
}
