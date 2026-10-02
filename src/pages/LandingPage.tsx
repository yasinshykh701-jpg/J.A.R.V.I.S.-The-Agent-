import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import {
  ChevronRight,
  Bot,
  Zap,
  Shield,
  Cpu,
  MessageSquare,
  Image as ImageIcon,
  Video,
  FileText,
  Briefcase,
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: '3D Virtual Assistant',
    description:
      'Interact with JARVIS, a fully animated 3D robot companion that understands your commands.',
    color: '#00c8ff',
  },
  {
    icon: Zap,
    title: 'Instant AI Generation',
    description:
      'Create high-quality images, videos, and presentations from plain text in seconds.',
    color: '#ffd700',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your data is never permanently stored. Everything clears when you close the session.',
    color: '#5566ff',
  },
];

const services = [
  { icon: MessageSquare, label: 'AI Chat' },
  { icon: ImageIcon,    label: 'Image Gen' },
  { icon: Video,        label: 'Video Gen' },
  { icon: Bot,          label: 'Virtual Robot' },
  { icon: FileText,     label: 'Resume AI' },
  { icon: Briefcase,    label: 'Interview Prep' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/', { replace: true });
      } else {
        setShowContent(true);
      }
    }
  }, [user, loading, navigate]);

  if (!showContent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Logo splash — matches image 1 */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/90" />
          <span className="text-white font-bold tracking-[0.28em] text-lg z-10"
            style={{ fontFamily: "'Orbitron', sans-serif" }}>
            J.A.R.V.I.S
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020810] text-white overflow-x-hidden">
      {/* ── Background layers ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#000510] via-[#020c1a] to-[#000510]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#00c8ff] opacity-[0.04] blur-[140px]" />
        {/* Scan lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.02) 2px, rgba(0,200,255,0.02) 4px)',
          }}
        />
        {/* Decorative HUD rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[800px] h-[800px] rounded-full border border-dashed border-[#00c8ff0a] animate-hud-spin-slow" />
          <div className="absolute inset-[80px] rounded-full border border-dashed border-[#00c8ff08] animate-hud-spin-reverse" />
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-4 border-b border-[#00c8ff15] backdrop-blur-md bg-[#00050f90]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center arc-glow-sm">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute inset-[-3px] rounded-full border border-[#00c8ff50] animate-hud-spin" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-[0.2em] uppercase jarvis-gradient-text">
              J.A.R.V.I.S
            </span>
            <p className="text-[8px] tracking-[0.3em] text-[#00c8ff70] uppercase leading-none">
              Intelligent System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/login')}
            variant="ghost"
            className="border border-[#00c8ff30] text-[#00c8ff] hover:bg-[#00c8ff15] hover:border-[#00c8ff60] rounded-full px-6 tracking-widest uppercase text-xs font-semibold"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-[#00c8ff] to-[#0080ff] text-black hover:from-[#00d4ff] hover:to-[#0090ff] rounded-full px-6 tracking-widest uppercase text-xs font-bold arc-glow-sm transition-all"
          >
            Get Access
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-4 pt-10 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff30] bg-[#00c8ff0a] mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-[#00c8ff] animate-arc-pulse" />
          <span className="text-xs font-semibold tracking-[0.25em] text-[#00c8ff] uppercase">
            System Online · All Systems Nominal
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-9xl font-black tracking-[0.1em] uppercase mb-3 animate-fade-in">
          <span className="jarvis-gradient-text">J.A.R.V.I.S</span>
        </h1>
        <p className="text-sm md:text-base tracking-[0.4em] text-[#00c8ff70] uppercase mb-4 font-medium animate-fade-in">
          Just A Rather Very Intelligent System
        </p>
        <p className="text-base md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed animate-fade-in">
          Your personal AI command center — generate, analyze, converse, and create with a
          cinematic-grade 3D AI companion.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in">
          <Button
            onClick={() => navigate('/register')}
            className="ios-button h-14 px-10 text-base bg-gradient-to-r from-[#00c8ff] to-[#0080ff] text-black font-bold tracking-widest uppercase arc-glow hover:scale-105 transition-transform"
          >
            Initialize System
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="ios-button h-14 px-10 text-base border-[#00c8ff40] bg-[#00c8ff08] text-[#00c8ff] hover:bg-[#00c8ff18] hover:border-[#00c8ff70] tracking-widest uppercase font-semibold"
          >
            Access System
          </Button>
        </div>

        {/* 3D Robot */}
        <div className="w-full max-w-xl h-[520px] relative animate-fade-in">
          {/* HUD frame */}
          <div className="absolute inset-0 rounded-3xl border border-[#00c8ff20] bg-[#00c8ff03] overflow-hidden">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00c8ff60] rounded-tl" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00c8ff60] rounded-tr" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00c8ff60] rounded-bl" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00c8ff60] rounded-br" />
            {/* Top bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00c8ff] animate-arc-pulse" />
              <span className="text-[8px] tracking-[0.3em] text-[#00c8ff80] uppercase">JARVIS · ACTIVE</span>
              <div className="w-2 h-2 rounded-full bg-[#00c8ff] animate-arc-pulse" />
            </div>
            {/* Left data panel */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {['PWR·100%','ARM·OK','SYS·LIVE','NET·ON'].map(l => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c8ff80] animate-arc-pulse" />
                  <span className="text-[7px] tracking-widest text-[#00c8ff60] uppercase">{l}</span>
                </div>
              ))}
            </div>
            {/* Right data panel */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-end">
              {['UNIT-01','WAR-BOT','ARMED','READY'].map(l => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className="text-[7px] tracking-widest text-[#00c8ff60] uppercase">{l}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c8ff80] animate-arc-pulse" />
                </div>
              ))}
            </div>
            {/* Bottom bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <span className="text-[7px] tracking-[0.3em] text-[#00c8ff50] uppercase">J.A.R.V.I.S</span>
              <div className="w-px h-3 bg-[#00c8ff30]" />
              <span className="text-[7px] tracking-[0.3em] text-[#00c8ff50] uppercase">TACTICAL·AI</span>
              <div className="w-px h-3 bg-[#00c8ff30]" />
              <span className="text-[7px] tracking-[0.3em] text-[#00c8ff50] uppercase">v2.0</span>
            </div>
          </div>
          <ErrorBoundary
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-7xl mb-4">🤖</div>
                  <p className="text-[#00c8ff80] tracking-widest text-sm">UNIT ONLINE</p>
                </div>
              </div>
            }
          >
            <TitanRobotAdvanced isListening={true} emotion="happy" />
          </ErrorBoundary>
        </div>
      </section>

      {/* ── Services strip ── */}
      <section className="relative z-10 py-10 border-y border-[#00c8ff10] bg-[#00050f80] backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-[9px] tracking-[0.4em] text-[#00c8ff60] uppercase mb-6">
            Integrated AI Modules
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#00c8ff20] bg-[#00c8ff06] text-[#00c8ffcc] text-xs font-semibold tracking-widest uppercase hover:border-[#00c8ff50] hover:bg-[#00c8ff12] transition-all cursor-default"
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[9px] tracking-[0.4em] text-[#00c8ff60] uppercase mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-wider uppercase">
              <span className="jarvis-gradient-text">Core Systems</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-8 rounded-2xl border border-[#00c8ff15] bg-[#00050f] hover:border-[#00c8ff40] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Glow corner */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"
                  style={{ backgroundColor: f.color }}
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${f.color}18`, border: `1px solid ${f.color}40` }}
                >
                  <f.icon className="h-6 w-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-wide text-white/90">{f.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-10 border-t border-[#00c8ff10] px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold tracking-[0.15em] uppercase text-sm jarvis-gradient-text">
              J.A.R.V.I.S
            </span>
          </div>
          <p className="text-xs text-white/25 tracking-widest uppercase">
            Presented by Y A S I N &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; All Systems Free
          </p>
        </div>
      </footer>
    </div>
  );
}
