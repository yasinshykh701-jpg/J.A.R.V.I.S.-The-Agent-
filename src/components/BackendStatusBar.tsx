/**
 * J.A.R.V.I.S Backend Status Bar
 * Gaming-style fixed indicator showing:
 *  • Live backend connection status
 *  • All module availability (Zevorix, RAG, Voice, Image-RAG)
 *  • Startup instructions if offline
 *  • Auto-retry every 5 s
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2, XCircle, RefreshCw, ChevronDown, ChevronUp,
  Zap, Brain, Mic, ImageIcon, Sparkles, Server, Terminal, X,
} from 'lucide-react';
import jarvisApi, { type HealthResponse } from '@/services/jarvisBackend';

const MODULE_ICONS: Record<string, React.ElementType> = {
  zevorix:      Zap,
  'jarvis-rag': Brain,
  'voice-system': Mic,
  'image-rag':  ImageIcon,
  unified:      Sparkles,
};
const MODULE_COLORS: Record<string, string> = {
  zevorix:       '#f43f5e',
  'jarvis-rag':  '#8b5cf6',
  'voice-system':'#10b981',
  'image-rag':   '#f59e0b',
  unified:       '#00c8ff',
};

export default function BackendStatusBar() {
  const [health,      setHealth]      = useState<HealthResponse | null>(null);
  const [online,      setOnline]      = useState<boolean | null>(null);
  const [expanded,    setExpanded]    = useState(false);
  const [dismissed,   setDismissed]   = useState(false);
  const [retrying,    setRetrying]    = useState(false);
  const [lastCheck,   setLastCheck]   = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = useCallback(async (quiet = false) => {
    if (!quiet) setRetrying(true);
    try {
      const h = await jarvisApi.health();
      setHealth(h);
      setOnline(true);
      setLastCheck(new Date());
    } catch {
      setHealth(null);
      setOnline(false);
      setLastCheck(new Date());
    } finally {
      if (!quiet) setRetrying(false);
    }
    timerRef.current = setTimeout(() => check(true), 8000);
  }, []);

  useEffect(() => {
    check(false);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [check]);

  // Don't render until first check
  if (online === null) return null;
  // If dismissed and online, hide
  if (dismissed && online) return null;

  const engines = health?.modules?.engines ?? [];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-300"
      style={{
        background: online
          ? 'rgba(0,10,20,0.92)'
          : 'rgba(20,5,5,0.97)',
        borderBottom: `1px solid ${online ? 'rgba(0,200,255,0.20)' : 'rgba(239,68,68,0.40)'}`,
        backdropFilter: 'blur(20px)',
        boxShadow: online
          ? '0 2px 20px rgba(0,200,255,0.08)'
          : '0 2px 20px rgba(239,68,68,0.15)',
      }}
    >
      {/* ── Main bar ── */}
      <div className="flex items-center justify-between px-4 py-1.5 max-w-screen-2xl mx-auto">

        {/* Left: status */}
        <div className="flex items-center gap-2.5">
          {online ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
          )}
          <span className="text-[9px] font-bold uppercase tracking-[0.25em]"
            style={{ color: online ? '#34d399' : '#f87171' }}>
            {online ? 'Backend Online' : 'Backend Offline'}
          </span>
          {online && (
            <span className="text-[8px] text-[#00c8ff50]">
              ·&nbsp;{jarvisApi.baseUrl}
            </span>
          )}
          {lastCheck && (
            <span className="text-[7px] text-white/20 hidden sm:inline">
              {lastCheck.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Centre: module pills (online only) */}
        {online && engines.length > 0 && (
          <div className="hidden md:flex items-center gap-1.5">
            {engines.map(e => {
              const Icon  = MODULE_ICONS[e.id]  ?? Sparkles;
              const color = MODULE_COLORS[e.id] ?? '#00c8ff';
              return (
                <div key={e.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-wide"
                  style={{
                    background: e.available ? `${color}14` : 'rgba(239,68,68,0.10)',
                    border:     `1px solid ${e.available ? color+'40' : 'rgba(239,68,68,0.30)'}`,
                    color:      e.available ? color : '#f87171',
                  }}>
                  <Icon className="w-2.5 h-2.5" />
                  {e.id.replace('-','·')}
                </div>
              );
            })}
          </div>
        )}

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {!online && (
            <button
              onClick={() => check(false)}
              disabled={retrying}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all"
              style={{ background:'rgba(0,200,255,0.12)', border:'1px solid rgba(0,200,255,0.35)', color:'#00c8ff' }}>
              <RefreshCw className={`w-2.5 h-2.5 ${retrying ? 'animate-spin' : ''}`} />
              Retry
            </button>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-[8px] text-white/40 hover:text-white/70 transition-colors">
            <Server className="w-3 h-3" />
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {online && (
            <button onClick={() => setDismissed(true)}
              className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div className="px-4 pb-3 max-w-screen-2xl mx-auto border-t border-white/05 pt-2.5 space-y-3">

          {online ? (
            <>
              {/* Module grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {engines.map(e => {
                  const Icon  = MODULE_ICONS[e.id]  ?? Sparkles;
                  const color = MODULE_COLORS[e.id] ?? '#00c8ff';
                  return (
                    <div key={e.id} className="flex items-start gap-2 p-2.5 rounded-xl"
                      style={{ background:'rgba(0,8,20,0.8)', border:`1px solid ${e.available ? color+'25' : 'rgba(239,68,68,0.20)'}` }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background:`${e.available ? color : '#ef4444'}18`, border:`1px solid ${e.available ? color+'35' : 'rgba(239,68,68,0.25)'}` }}>
                        <Icon className="w-3 h-3" style={{ color: e.available ? color : '#f87171' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-white/80 truncate">{e.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: e.available ? color : '#ef4444' }} />
                          <span className="text-[7px]" style={{ color: e.available ? color+'90' : '#f8717190' }}>
                            {e.available ? 'active' : 'unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Workspace path */}
              {health?.workspace && (
                <p className="text-[7px] font-mono text-white/25 flex items-center gap-1.5">
                  <Server className="w-2.5 h-2.5" />
                  {health.workspace}
                </p>
              )}
            </>
          ) : (
            /* Offline instructions */
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-widest">
                <Terminal className="w-3 h-3" />
                Start the backend to enable all AI features
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Quick start (recommended)', cmd: 'npm run start:all' },
                  { label: 'Backend only',              cmd: 'npm run jarvis:unified' },
                  { label: 'Direct python',             cmd: 'python server/jarvis_unified.py' },
                ].map(item => (
                  <div key={item.cmd} className="flex flex-col gap-0.5 p-2.5 rounded-xl"
                    style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[7px] text-white/30 uppercase tracking-widest">{item.label}</span>
                    <code className="text-[10px] font-mono text-emerald-400">{item.cmd}</code>
                  </div>
                ))}
              </div>
              <p className="text-[7px] text-white/25">
                The backend auto-loads: Zevorix LLM Engine 1.0 · Image RAG Pipeline · JARVIS RAG · Voice System Control
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
