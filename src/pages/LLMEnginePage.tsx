/**
 * J.A.R.V.I.S — LLM Engine Selector + Chat
 *
 * Lets users pick and chat with any of the workspace LLM engines:
 *  • Unified Auto Router  — smart auto-selects the best engine
 *  • Zevorix LLM 1.0      — local Flan-T5 / ChromaDB RAG
 *  • JARVIS RAG Engine    — LangChain document QA
 *  • Voice System Control — voice commands via brain
 *  • Gemini AI            — Google Gemini via Supabase
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles, Cpu, Brain, Mic, MessageSquare, Image as ImageIcon,
  Send, Loader2, CheckCircle2, XCircle,
  Server, RefreshCw, ArrowUp, ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import jarvisApi, { type Engine, type ChatResponse } from '@/services/jarvisBackend';
import { supabase } from '@/services/aiServices';

/* ─── Engine definitions ──────────────────────────────────────── */

interface EngineOption {
  id:          Engine | 'gemini';
  name:        string;
  subtitle:    string;
  description: string;
  icon:        React.ElementType;
  accent:      string;
  local:       boolean;
  badge:       string;
  folder?:     string;
}

const ENGINES: EngineOption[] = [
  {
    id: 'unified',
    name: 'Unified Auto Brain',
    subtitle: 'Smart router · all engines',
    description: 'Automatically picks the best engine based on your query. Default for most use cases.',
    icon: Sparkles,
    accent: '#00c8ff',
    local: true,
    badge: 'Auto',
  },
  {
    id: 'zevorix',
    name: 'Zevorix LLM 1.0',
    subtitle: 'Local · Flan-T5 · ChromaDB',
    description: 'Fully local HuggingFace LLM with Retrieval-Augmented Generation. No API key needed.',
    icon: Cpu,
    accent: '#f43f5e',
    local: true,
    badge: 'Local',
    folder: 'D:\\J.A.R.V.I.S\\Zevorix LLM Engine 1.0',
  },
  {
    id: 'jarvis-rag',
    name: 'JARVIS RAG Engine',
    subtitle: 'Local · LangChain · Docs',
    description: 'Document question-answering with LangChain, ChromaDB, and your local files.',
    icon: Brain,
    accent: '#8b5cf6',
    local: true,
    badge: 'Local',
    folder: 'D:\\J.A.R.V.I.S\\JARVIS\\rag',
  },
  {
    id: 'voice-system',
    name: 'Voice System Control',
    subtitle: 'Local · Commands · Automation',
    description: 'Execute desktop commands: open apps, search, play media, get weather & news.',
    icon: Mic,
    accent: '#10b981',
    local: true,
    badge: 'Local',
    folder: 'D:\\J.A.R.V.I.S\\SYSTEM CONTROL ON VOICE',
  },
  {
    id: 'image-rag',
    name: 'Image RAG Pipeline',
    subtitle: 'Local · Image generation',
    description: 'Prompt-engineered image generation from D:\\J.A.R.V.I.S\\image egeneration.',
    icon: ImageIcon,
    accent: '#f59e0b',
    local: true,
    badge: 'Local',
    folder: 'D:\\J.A.R.V.I.S\\image egeneration',
  },
  {
    id: 'gemini',
    name: 'Gemini AI',
    subtitle: 'Cloud · Google AI',
    description: 'Google Gemini via Supabase Edge Functions. Requires internet + API key.',
    icon: MessageSquare,
    accent: '#f59e0b',
    local: false,
    badge: 'Cloud',
  },
];

/* ─── Message types ────────────────────────────────────────────── */

interface Msg {
  id:      string;
  role:    'user' | 'assistant';
  text:    string;
  source?: string;
  engine?: string;
  sources?: Array<{ source: string; page: string | number; snippet: string }>;
  image_url?: string;
  error?:  boolean;
}

/* ─── Component ────────────────────────────────────────────────── */

export default function LLMEnginePage() {
  const [selectedEngine, setSelectedEngine] = useState<string>('unified');
  const [messages, setMessages]   = useState<Msg[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [showEngines, setShowEngines] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const taRef     = useRef<HTMLTextAreaElement>(null);

  const engine = ENGINES.find(e => e.id === selectedEngine) ?? ENGINES[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = `${taRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Check backend health on mount
  useEffect(() => {
    jarvisApi.health()
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');

    const userMsg: Msg = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      let res: ChatResponse;

      if (selectedEngine === 'gemini') {
        // Use Supabase Gemini directly
        const chunks: string[] = [];
        await new Promise<void>((resolve, reject) => {
          import('@/services/aiServices').then(({ sendChatMessage, createTextMessage }) => {
            const history = messages.map(m => createTextMessage(m.text, m.role === 'user' ? 'user' : 'model'));
            history.push(createTextMessage(text, 'user'));
            sendChatMessage(
              history,
              chunk => chunks.push(chunk),
              () => resolve(),
              reject,
            );
          });
        });
        res = {
          response: chunks.join(''),
          source:   'Gemini AI (Google)',
          engine:   'gemini',
        };
      } else {
        res = await jarvisApi.chat(text, selectedEngine as Engine);
      }

      const assistantMsg: Msg = {
        id:         (Date.now() + 1).toString(),
        role:       'assistant',
        text:       res.response ?? res.error ?? 'No response',
        source:     res.source,
        engine:     res.engine,
        sources:    res.sources,
        image_url:  res.image_url,
        error:      !!res.error && !res.response,
      };
      setMessages(prev => [...prev, assistantMsg]);

    } catch (e: any) {
      const errMsg: Msg = {
        id:    (Date.now() + 1).toString(),
        role:  'assistant',
        text:  e.message ?? 'Request failed',
        error: true,
        source: engine.name,
      };
      setMessages(prev => [...prev, errMsg]);
      toast.error(e.message ?? 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <AppLayout>
      <BackToHome />
      <div className="flex flex-col h-full bg-[#020810]">
        {/* Scanlines */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.008) 2px,rgba(0,200,255,0.008) 4px)' }} />

        {/* ── Header with engine picker ── */}
        <div className="relative z-10 px-4 py-3 border-b"
          style={{ borderColor:'rgba(0,200,255,0.12)', background:'rgba(0,3,10,0.92)', backdropFilter:'blur(20px)' }}>

          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            {/* Current engine pill */}
            <button
              onClick={() => setShowEngines(v => !v)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full transition-all"
              style={{
                background: `${engine.accent}12`,
                border: `1px solid ${engine.accent}45`,
                boxShadow: `0 0 12px ${engine.accent}18`,
              }}
            >
              <engine.icon className="w-4 h-4" style={{ color: engine.accent }} />
              <div className="text-left">
                <p className="text-xs font-bold leading-tight" style={{ color: engine.accent }}>{engine.name}</p>
                <p className="text-[8px] text-white/40">{engine.subtitle}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEngines ? 'rotate-180' : ''}`}
                style={{ color: engine.accent }} />
            </button>

            {/* Backend status */}
            <div className="flex items-center gap-1.5 text-[9px]">
              {backendOk === null && <RefreshCw className="w-3 h-3 text-[#00c8ff60] animate-spin" />}
              {backendOk === true  && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              {backendOk === false && <XCircle className="w-3 h-3 text-red-400" />}
              <span className={backendOk === false ? 'text-red-400' : 'text-[#00c8ff60]'}>
                {backendOk === null ? 'Checking…' : backendOk ? 'Backend online' : 'Backend offline'}
              </span>
              {backendOk === false && (
                <code className="ml-1 text-[7px] font-mono text-emerald-400/70">npm run jarvis:unified</code>
              )}
            </div>
          </div>

          {/* Engine dropdown */}
          {showEngines && (
            <div className="max-w-3xl mx-auto mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {ENGINES.map(e => {
                const Icon = e.icon;
                const active = selectedEngine === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => { setSelectedEngine(e.id); setShowEngines(false); }}
                    className="flex items-start gap-2 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: active ? `${e.accent}14` : 'rgba(0,8,20,0.8)',
                      border: `1px solid ${active ? e.accent+'55' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background:`${e.accent}18`, border:`1px solid ${e.accent}35` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: e.accent }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/85 leading-tight">{e.name}</p>
                      <p className="text-[7px] mt-0.5" style={{ color: e.accent }}>{e.subtitle}</p>
                      <div className="mt-1">
                        <span className="text-[7px] px-1.5 py-0.5 rounded font-bold"
                          style={{
                            background: e.local ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                            color: e.local ? '#34d399' : '#60a5fa',
                          }}>
                          {e.badge}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Messages ── */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-3xl mx-auto space-y-4">

            {messages.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center"
                    style={{ boxShadow:'0 0 20px rgba(0,200,255,0.4)' }}>
                    <engine.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black tracking-[0.15em] uppercase jarvis-gradient-text">{engine.name}</p>
                  <p className="text-[9px] text-white/40 mt-1 max-w-xs mx-auto leading-relaxed">{engine.description}</p>
                </div>
                {engine.local && engine.folder && (
                  <p className="text-[8px] font-mono text-white/25">{engine.folder}</p>
                )}
                {/* Suggested queries */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {[
                    selectedEngine === 'voice-system' ? 'Open Chrome' : 'What is RAG?',
                    selectedEngine === 'zevorix' ? 'Summarise my documents' : selectedEngine === 'voice-system' ? 'What is the weather?' : 'Explain neural networks',
                    selectedEngine === 'voice-system' ? 'Play music' : 'Who is Yasin?',
                  ].map((q, i) => (
                    <button key={i} onClick={() => setInput(q)}
                      className="px-3 py-1.5 rounded-full text-[9px] font-semibold transition-all hover:-translate-y-0.5"
                      style={{ background:`${engine.accent}10`, border:`1px solid ${engine.accent}30`, color:engine.accent }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id}
                className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:`${engine.accent}20`, border:`1px solid ${engine.accent}45`, boxShadow:`0 0 8px ${engine.accent}30` }}>
                    <engine.icon className="w-3.5 h-3.5" style={{ color: engine.accent }} />
                  </div>
                )}

                <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.error ? 'border border-red-500/30 bg-red-950/20' : ''}`}
                  style={msg.role === 'user'
                    ? { background:'rgba(0,200,255,0.10)', border:'1px solid rgba(0,200,255,0.25)', color:'rgba(240,244,255,0.90)' }
                    : { background:'rgba(0,8,20,0.85)', border:`1px solid ${msg.error ? '' : 'rgba(255,255,255,0.06)'}`, color:'rgba(240,244,255,0.80)' }
                  }>
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>

                  {/* Image result */}
                  {msg.image_url && (
                    <img src={msg.image_url} alt="Generated" className="mt-2 rounded-lg max-w-full" />
                  )}

                  {/* Source + engine tag */}
                  {msg.role === 'assistant' && (msg.source ?? msg.engine) && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/05 flex-wrap">
                      {msg.engine && (
                        <span className="text-[7px] px-2 py-0.5 rounded font-bold uppercase"
                          style={{ background:`${engine.accent}12`, color: engine.accent }}>
                          {msg.engine}
                        </span>
                      )}
                      {msg.source && msg.source !== msg.engine && (
                        <span className="text-[7px] text-white/30">{msg.source}</span>
                      )}
                    </div>
                  )}

                  {/* RAG sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/05 space-y-1">
                      <p className="text-[7px] font-bold text-white/35 uppercase tracking-widest">Sources</p>
                      {msg.sources.slice(0,3).map((s, i) => (
                        <div key={i} className="text-[8px] text-white/40 flex gap-1">
                          <span className="text-[#00c8ff60]">•</span>
                          <span>{s.source} {s.page !== '?' ? `p.${s.page}` : ''}: {s.snippet.slice(0,80)}…</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full border border-[#00c8ff30] bg-[#00c8ff10] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-[#00c8ff]">U</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background:`${engine.accent}20`, border:`1px solid ${engine.accent}45` }}>
                  <engine.icon className="w-3.5 h-3.5 animate-pulse" style={{ color: engine.accent }} />
                </div>
                <div className="bg-[#00050f] border border-white/06 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    {[0,150,300].map(d => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ backgroundColor: engine.accent + '88', animationDelay:`${d}ms` }} />
                    ))}
                    <span className="text-[9px] ml-1" style={{ color: engine.accent + '80' }}>
                      {engine.name} processing…
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Input bar ── */}
        <div className="relative z-10 px-4 pb-4 pt-3 border-t"
          style={{ borderColor:'rgba(0,200,255,0.10)', background:'rgba(0,3,10,0.92)', backdropFilter:'blur(20px)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 p-3 rounded-3xl"
              style={{
                background: 'rgba(0,12,28,0.85)',
                border: `1px solid ${engine.accent}28`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${engine.accent}08`,
                backdropFilter: 'blur(20px)',
              }}>
              <Textarea
                ref={taRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder={`Ask ${engine.name}…`}
                className="flex-1 min-h-[36px] max-h-[160px] resize-none border-0 bg-transparent
                  focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-white/85
                  placeholder:text-white/30 py-1.5 px-1"
                rows={1}
              />
              <Button
                onClick={send}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 disabled:opacity-35 transition-all"
                style={{
                  background: input.trim() && !loading ? `linear-gradient(135deg,${engine.accent},${engine.accent}bb)` : 'rgba(255,255,255,0.08)',
                  boxShadow: input.trim() && !loading ? `0 0 14px ${engine.accent}40` : 'none',
                }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <ArrowUp className="w-4 h-4 text-white" />}
              </Button>
            </div>
            <p className="text-[7px] text-center text-white/20 tracking-widest uppercase mt-2">
              {engine.name} · {engine.local ? 'Local Backend' : 'Cloud API'} · {engine.subtitle}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
