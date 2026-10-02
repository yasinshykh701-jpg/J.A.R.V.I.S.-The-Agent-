import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import {
  Mic, Sparkles, Lightbulb, Code,
  FileText, Cpu, ArrowUp,
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import { voiceFeedback } from '@/services/voiceFeedback';
import BackToHome from '@/components/BackToHome';
import ModelSelector from '@/components/ModelSelector';
import type { ZevorixModel } from '@/services/zevorixService';

const CHIPS = [
  { icon: Sparkles,  text: 'Explain quantum computing',   color: '#00c8ff' },
  { icon: Lightbulb, text: 'Give me creative writing ideas', color: '#fbbf24' },
  { icon: Code,      text: 'Help me debug my code',        color: '#a855f7' },
  { icon: FileText,  text: 'Summarise this document',      color: '#4ade80' },
];

export default function ChatPage() {
  const { messages, sendMessage } = useChatHistory();
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [model, setModel]         = useState<ZevorixModel>('zevorix');
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const taRef                     = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = `${taRef.current.scrollHeight}px`;
    }
  }, [input]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput('');
    setLoading(true);
    try {
      await sendMessage(txt);
      voiceFeedback.success('Message sent');
    } catch { voiceFeedback.error('Failed'); }
    finally { setLoading(false); }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const hasMessages = messages.length > 0;

  return (
    <AppLayout>
      <BackToHome />
      <div className="flex flex-col h-full bg-[#020810] relative">

        {/* Scanlines */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.010) 2px,rgba(0,200,255,0.010) 4px)' }} />

        {/* ── Messages area ── */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {!hasMessages ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-4 py-10">
              <div className="max-w-xl w-full space-y-6">
                {/* Brand */}
                <div className="text-center space-y-2">
                  <div className="relative w-14 h-14 mx-auto">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center"
                      style={{ boxShadow:'0 0 20px rgba(0,200,255,0.5)' }}>
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-[-3px] rounded-full border border-dashed border-[#00c8ff50] animate-hud-spin" />
                  </div>
                  <h2 className="text-xl font-black tracking-[0.2em] uppercase jarvis-gradient-text">
                    J.A.R.V.I.S
                  </h2>
                  <p className="text-[9px] tracking-[0.35em] text-[#00c8ff60] uppercase">
                    How can I assist you?
                  </p>
                </div>

                {/* Suggestion chips */}
                <div className="grid grid-cols-2 gap-2">
                  {CHIPS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(c.text)}
                      className="group flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background:'rgba(0,20,40,0.7)',
                        border:`1px solid ${c.color}25`,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${c.color}55`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${c.color}18`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${c.color}25`;
                        (e.currentTarget as HTMLElement).style.boxShadow = '';
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background:`${c.color}14`, border:`1px solid ${c.color}35` }}>
                        <c.icon className="w-3.5 h-3.5" style={{ color:c.color }} />
                      </div>
                      <p className="text-xs text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">{c.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message list */
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
              {messages.map(msg => (
                <div key={msg.id}
                  className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center shrink-0 mt-0.5"
                      style={{ boxShadow:'0 0 10px rgba(0,200,255,0.4)' }}>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#00c8ff20] to-[#0050a020] border border-[#00c8ff30] text-white/90'
                      : 'bg-[#00050f] border border-[#00c8ff15] text-white/80'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full border border-[#00c8ff30] bg-[#00c8ff12] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#00c8ff]">U</span>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center shrink-0"
                    style={{ boxShadow:'0 0 10px rgba(0,200,255,0.4)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  </div>
                  <div className="bg-[#00050f] border border-[#00c8ff15] rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      {[0,150,300].map(d => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#00c8ff60] animate-bounce"
                          style={{ animationDelay:`${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input bar — iOS style ── */}
        <div className="relative z-10 px-4 pb-4 pt-3 border-t border-[#00c8ff12] bg-[#00030a95] backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 p-3 rounded-3xl"
              style={{
                background: 'rgba(0,12,28,0.85)',
                border: '1px solid rgba(0,200,255,0.2)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)',
              }}>
              {/* Mic */}
              <Button variant="ghost" size="icon"
                className="h-9 w-9 rounded-full shrink-0 text-[#00c8ff60] hover:text-[#00c8ff] hover:bg-[#00c8ff10] transition-all">
                <Mic className="w-4 h-4" />
              </Button>

              {/* Text input */}
              <Textarea
                ref={taRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask J.A.R.V.I.S anything…"
                className="flex-1 min-h-[36px] max-h-[160px] resize-none border-0 bg-transparent
                  focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-white/85
                  placeholder:text-[#00c8ff40] py-2 px-1"
                rows={1}
              />

              {/* Model selector */}
              <ModelSelector
                selected={model}
                onChange={setModel}
                compact
              />

              {/* Send */}
              <Button
                onClick={send}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg,#00c8ff,#0080ff)'
                    : 'rgba(0,200,255,0.15)',
                  boxShadow: input.trim() && !loading ? '0 0 14px rgba(0,200,255,0.4)' : 'none',
                }}
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </Button>
            </div>

            <p className="text-[8px] text-center text-[#00c8ff30] tracking-widest uppercase mt-2">
              Zevorix AI · Local Model · Always Free
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
