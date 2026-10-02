import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Image as ImageIcon, Video, Bot,
  Briefcase, UserCheck, Sparkles, FileText,
  ArrowUpRight, Cpu, Activity, Zap,
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';

const FEATURES = [
  { id:'chat',      name:'AI Chat',          desc:'Intelligent AI conversations',      icon:MessageSquare, color:'#00c8ff', path:'/chat'            },
  { id:'image',     name:'Image Generator',  desc:'Create stunning AI visuals',        icon:ImageIcon,     color:'#a855f7', path:'/ai-image-generation' },
  { id:'video',     name:'Video Generator',  desc:'Generate videos from text',         icon:Video,         color:'#f43f5e', path:'/video-generation' },
  { id:'robot',     name:'Virtual Robot',    desc:'Talk to the Hulkbuster AI',         icon:Bot,           color:'#22d3ee', path:'/virtual-robot'   },
  { id:'resume',    name:'Resume Analyzer',  desc:'AI-powered resume feedback',        icon:Briefcase,     color:'#4ade80', path:'/resume-analysis'  },
  { id:'interview', name:'Interview Bot',    desc:'Practice with AI interviewer',      icon:UserCheck,     color:'#fbbf24', path:'/interview-prep'   },
  { id:'prompt',    name:'Prompt Generator', desc:'Generate optimised AI prompts',     icon:Sparkles,      color:'#fb923c', path:'/prompt-generator' },
  { id:'notes',     name:'Note Summary',     desc:'Summarise docs instantly',          icon:FileText,      color:'#38bdf8', path:'/note-summary'     },
];

const STATS = [
  { label:'AI Modules',  value:'9',      icon:Cpu,      color:'#00c8ff' },
  { label:'Models',      value:'4+',     icon:Activity, color:'#a855f7' },
  { label:'Access',      value:'Free',   icon:Zap,      color:'#4ade80' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto bg-[#020810]">
        {/* Scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.012) 2px,rgba(0,200,255,0.012) 4px)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-6">

          {/* ── Header ── */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center shrink-0"
              style={{ boxShadow:'0 0 20px rgba(0,200,255,0.5),0 0 40px rgba(0,200,255,0.25)' }}>
              <Cpu className="w-6 h-6 text-white" />
              <div className="absolute inset-[-3px] rounded-full border border-dashed border-[#00c8ff50] animate-hud-spin" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-[0.15em] uppercase jarvis-gradient-text leading-none">
                J.A.R.V.I.S Dashboard
              </h1>
              <p className="text-[9px] tracking-[0.3em] text-[#00c8ff60] uppercase mt-0.5">
                All systems operational · 9 modules active
              </p>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(s => (
              <div key={s.label}
                className="ios-card flex items-center gap-3 py-3 px-4"
                style={{ borderColor:`${s.color}25` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background:`${s.color}14`, border:`1px solid ${s.color}35` }}>
                  <s.icon className="w-4 h-4" style={{ color:s.color }} />
                </div>
                <div>
                  <p className="text-lg font-black leading-none" style={{ color:s.color }}>{s.value}</p>
                  <p className="text-[8px] tracking-[0.25em] text-[#00c8ff50] uppercase">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Features grid ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00c8ff20]" />
              <span className="text-[8px] tracking-[0.4em] text-[#00c8ff50] uppercase">AI Modules</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00c8ff20]" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => navigate(f.path)}
                    className="group relative text-left p-4 rounded-2xl transition-all duration-300
                      hover:-translate-y-1 overflow-hidden ios-card"
                    style={{ borderColor:`${f.color}20` }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${f.color}50`;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${f.color}20, 0 0 0 1px ${f.color}15`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${f.color}20`;
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                    }}
                  >
                    {/* Hover glow */}
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 pointer-events-none"
                      style={{ background:`${f.color}18` }} />

                    <div className="relative flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background:`${f.color}12`, border:`1px solid ${f.color}35` }}>
                        <Icon className="w-5 h-5" style={{ color:f.color }} />
                      </div>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0"
                        style={{ color:f.color }}
                      />
                    </div>

                    <p className="text-xs font-bold tracking-wide uppercase text-white/85 mb-1">{f.name}</p>
                    <p className="text-[9px] text-[#00c8ff40] leading-relaxed">{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Footer badge ── */}
          <div className="ios-card text-center py-3 border-[#00c8ff15]">
            <p className="text-[9px] tracking-[0.3em] uppercase font-bold"
              style={{ background:'linear-gradient(135deg,#00c8ff,#0080ff,#00c8ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              ⚡ All Modules · Lifetime Free · Unlimited Access
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
