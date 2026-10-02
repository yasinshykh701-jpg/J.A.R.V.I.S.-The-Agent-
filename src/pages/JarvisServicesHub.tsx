/**
 * J.A.R.V.I.S Services Hub
 * Shows ALL connected workspace modules with live status:
 *  • Zevorix LLM Engine 1.0  (local Flan-T5 / ChromaDB RAG)
 *  • JARVIS RAG Engine       (LangChain document QA)
 *  • Voice System Control    (desktop automation + commands)
 *  • Image RAG Pipeline      (prompt engineering + image gen)
 *  • Unified Brain           (auto-router)
 * Plus all existing AI services in the web app
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Brain, Mic, Image as ImageIcon, Sparkles,
  MessageSquare, Video, Bot, FileText, Briefcase,
  Lightbulb, FileSpreadsheet, Scissors, Activity,
  CheckCircle2, XCircle, Loader2, RefreshCw,
  ChevronRight, Server, Cpu, Database,
  FolderOpen, Terminal, Play,
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import jarvisApi, { type HealthResponse } from '@/services/jarvisBackend';
import { getDevices, type IoTDevice } from '@/services/iotApi';

/* ── Icon map for engine icons from backend ─────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Brain, Mic, Image: ImageIcon, Sparkles, Activity,
};

/* ── All web-app AI services ─────────────────────────────────────── */
const WEB_SERVICES = [
  { icon: MessageSquare, name: 'AI Chat',           path: '/chat',                accent: '#3b82f6',  desc: 'Intelligent multi-turn conversations' },
  { icon: ImageIcon,     name: 'Image Generation',  path: '/ai-image-generation', accent: '#8b5cf6',  desc: 'Generate images from text prompts' },
  { icon: Video,         name: 'Video Generation',  path: '/ai-video-generation', accent: '#ef4444',  desc: 'Create AI-generated videos' },
  { icon: Bot,           name: 'Virtual Robot',     path: '/virtual-robot',       accent: '#06b6d4',  desc: 'Talk with the JARVIS Hulkbuster AI' },
  { icon: FileText,      name: 'Resume Analysis',   path: '/resume-analysis',     accent: '#10b981',  desc: 'AI-powered resume review' },
  { icon: Briefcase,     name: 'Interview Prep',    path: '/interview-prep',      accent: '#f59e0b',  desc: 'Practice with AI interviewer' },
  { icon: Lightbulb,     name: 'Prompt Generator',  path: '/prompt-generator',    accent: '#f97316',  desc: 'Generate optimised AI prompts' },
  { icon: FileSpreadsheet,name:'PPT Maker',          path: '/ppt-maker',           accent: '#0ea5e9',  desc: 'Create presentations with AI' },
  { icon: Scissors,      name: 'Video Editor',      path: '/video-editor',        accent: '#d946ef',  desc: 'AI-assisted video editing' },
];

/* ── Backend workspace service card ─────────────────────────────── */
function EngineCard({
  engine, onLaunch,
}: {
  engine: { id: string; name: string; description: string; available: boolean; icon: string };
  onLaunch: (id: string) => void;
}) {
  const Icon = ICON_MAP[engine.icon] ?? Sparkles;
  const accent = engine.available ? '#00c8ff' : '#6b7280';

  return (
    <div
      className="relative p-5 rounded-2xl transition-all duration-300 group"
      style={{
        background: 'rgba(0,8,20,0.85)',
        border: `1px solid ${engine.available ? '#00c8ff25' : '#ffffff10'}`,
        boxShadow: engine.available ? '0 0 20px rgba(0,200,255,0.05)' : 'none',
      }}
    >
      {/* Status badge */}
      <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
        engine.available
          ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-400'
          : 'bg-red-950/40 border border-red-500/30 text-red-400'
      }`}>
        {engine.available
          ? <CheckCircle2 className="w-2.5 h-2.5" />
          : <XCircle className="w-2.5 h-2.5" />}
        {engine.available ? 'Online' : 'Offline'}
      </div>

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>

      <h3 className="text-sm font-bold text-white/90 mb-1">{engine.name}</h3>
      <p className="text-[10px] text-white/45 leading-relaxed mb-3">{engine.description}</p>

      <button
        onClick={() => onLaunch(engine.id)}
        className="flex items-center gap-1.5 text-[9px] font-semibold tracking-widest uppercase transition-all"
        style={{ color: accent }}
      >
        <Play className="w-3 h-3" />
        {engine.available ? 'Launch' : 'Open anyway'}
      </button>
    </div>
  );
}

/* ── Folder path card ────────────────────────────────────────────── */
function FolderCard({ name, path, available }: { name: string; path: string; available: boolean }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(0,8,20,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        available ? 'bg-emerald-950/60 border border-emerald-500/40' : 'bg-red-950/40 border border-red-500/30'
      }`}>
        <FolderOpen className={`w-4 h-4 ${available ? 'text-emerald-400' : 'text-red-400'}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-white/80">{name}</p>
        <p className="text-[8px] text-white/35 font-mono truncate mt-0.5">{path}</p>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function JarvisServicesHub() {
  const navigate   = useNavigate();
  const [health, setHealth]   = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const [devices, setDevices] = useState<IoTDevice[]>([]);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const h = await jarvisApi.health();
      setHealth(h);
      setLastPoll(new Date());
      try {
        setDevices(await getDevices());
      } catch {
        setDevices([]);
      }
    } catch (e) {
      setError('Backend offline — run: python server/jarvis_unified.py');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHealth(); }, []);

  const handleEngineLaunch = (id: string) => {
    const routes: Record<string, string> = {
      'zevorix':      '/chat?engine=zevorix',
      'jarvis-rag':   '/chat?engine=jarvis-rag',
      'voice-system': '/virtual-robot',
      'image-rag':    '/ai-image-generation',
      'unified':      '/chat',
    };
    const target = routes[id] ?? '/chat';
    navigate(target);
  };

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto bg-[#020810]">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.010) 2px,rgba(0,200,255,0.010) 4px)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(0,200,255,0.5)' }}>
                <Server className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-[0.12em] uppercase jarvis-gradient-text">
                  Services Hub
                </h1>
                <p className="text-[8px] tracking-[0.3em] text-[#00c8ff60] uppercase">
                  All J.A.R.V.I.S modules connected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastPoll && (
                <span className="text-[8px] text-[#00c8ff50] tracking-widest">
                  Last check: {lastPoll.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchHealth}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all"
                style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.25)', color: '#00c8ff' }}
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[#00c8ff20] to-transparent" />
              <span className="text-[8px] font-bold tracking-[0.4em] text-[#00c8ff60] uppercase">
                IoT Device Control
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#00c8ff20] to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {devices.length === 0 ? (
                <div className="col-span-full p-4 rounded-xl text-[10px] text-white/45"
                  style={{ background: 'rgba(0,8,20,0.7)', border: '1px solid rgba(0,200,255,0.12)' }}>
                  No registered devices. Use “register device &lt;name&gt; over wifi” from voice control.
                </div>
              ) : devices.map(device => (
                <div key={device.id || device.name} className="p-3 rounded-xl"
                  style={{ background: 'rgba(0,8,20,0.7)', border: '1px solid rgba(0,200,255,0.16)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/85">{device.name}</span>
                    <span className="text-[8px] uppercase text-emerald-300">{device.status}</span>
                  </div>
                  <p className="mt-1 text-[9px] text-white/40">{device.transport || 'unknown'} · {device.type || 'generic'}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Backend status ── */}
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(0,8,20,0.85)', border: `1px solid ${error ? 'rgba(239,68,68,0.35)' : 'rgba(0,200,255,0.20)'}` }}>
            <div className="flex items-center gap-3 flex-wrap">
              {loading ? (
                <><Loader2 className="w-4 h-4 text-[#00c8ff] animate-spin" />
                  <span className="text-xs text-[#00c8ff80]">Connecting to backend…</span></>
              ) : error ? (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400">{error}</span>
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                    <Terminal className="w-3 h-3" />
                    python server/jarvis_unified.py
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">
                    Unified backend online — {jarvisApi.baseUrl}
                  </span>
                  <div className="ml-auto flex items-center gap-2 flex-wrap">
                    {health?.modules && Object.entries(health.modules)
                      .filter(([k]) => !['engines','frontend'].includes(k))
                      .map(([k, v]) => typeof v === 'boolean' ? (
                        <div key={k} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-bold uppercase"
                          style={{
                            background: v ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                            border: `1px solid ${v ? 'rgba(16,185,129,0.30)' : 'rgba(239,68,68,0.25)'}`,
                            color: v ? '#34d399' : '#f87171',
                          }}>
                          {v ? <CheckCircle2 className="w-2 h-2" /> : <XCircle className="w-2 h-2" />}
                          {k.replace(/-/g,' ')}
                        </div>
                      ) : null)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Workspace Engine Cards ── */}
          {health?.modules?.engines && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00c8ff20] to-transparent" />
                <span className="text-[8px] font-bold tracking-[0.4em] text-[#00c8ff60] uppercase flex items-center gap-1.5">
                  <Database className="w-3 h-3" />
                  Workspace AI Engines
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00c8ff20] to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {health.modules.engines.map(engine => (
                  <EngineCard key={engine.id} engine={engine} onLaunch={handleEngineLaunch} />
                ))}
              </div>
            </section>
          )}

          {/* ── Folder paths ── */}
          {health?.paths && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#00c8ff20] to-transparent" />
                <span className="text-[8px] font-bold tracking-[0.4em] text-[#00c8ff60] uppercase flex items-center gap-1.5">
                  <FolderOpen className="w-3 h-3" />
                  Connected Workspace Folders
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#00c8ff20] to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(health.paths)
                  .filter(([k]) => !['app', 'workspace'].includes(k))
                  .map(([key, info]) => (
                  <FolderCard
                    key={key}
                    name={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    path={info.path}
                    available={info.available}
                  />
                ))}
              </div>
              {/* Workspace root */}
              {health.paths.workspace && (
                <div className="mt-2 p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.15)' }}>
                  <Cpu className="w-4 h-4 text-[#00c8ff]" />
                  <div>
                    <p className="text-[9px] font-bold text-[#00c8ff80] uppercase tracking-widest">Workspace Root</p>
                    <p className="text-[10px] font-mono text-white/60">{health.paths.workspace.path}</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Web App AI Services ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[#00c8ff20] to-transparent" />
              <span className="text-[8px] font-bold tracking-[0.4em] text-[#00c8ff60] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Web AI Services
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#00c8ff20] to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {WEB_SERVICES.map(s => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.path}
                    onClick={() => navigate(s.path)}
                    className="group relative p-4 rounded-2xl text-left transition-all duration-200 hover:-translate-y-1"
                    style={{ background: 'rgba(0,8,20,0.85)', border: `1px solid ${s.accent}20` }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${s.accent}50`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${s.accent}18`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${s.accent}20`;
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none transition-opacity"
                      style={{ background: `${s.accent}18` }} />
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${s.accent}14`, border: `1px solid ${s.accent}35` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: s.accent }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-white/85 mb-0.5">{s.name}</p>
                    <p className="text-[8px] text-white/40 leading-relaxed">{s.desc}</p>
                    <ChevronRight
                      className="absolute bottom-3 right-3 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0"
                      style={{ color: s.accent }}
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Start backend instructions ── */}
          {error && (
            <div className="p-5 rounded-2xl"
              style={{ background: 'rgba(0,8,20,0.9)', border: '1px solid rgba(0,200,255,0.15)' }}>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#00c8ff] mb-3 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Start the Backend
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Unified (all services)', cmd: 'npm run jarvis:unified' },
                  { label: 'Single server',          cmd: 'python server/jarvis_unified.py' },
                  { label: 'All services at once',   cmd: 'npm run start:all' },
                ].map(item => (
                  <div key={item.cmd} className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <code className="text-[10px] font-mono text-emerald-400 flex-1">{item.cmd}</code>
                    <span className="text-[8px] text-white/30">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="p-3 rounded-xl text-center"
            style={{ background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.12)' }}>
            <p className="text-[8px] font-bold tracking-[0.25em] uppercase jarvis-gradient-text">
              ⚡ All J.A.R.V.I.S Modules · Lifetime Free · Unlimited Access
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
