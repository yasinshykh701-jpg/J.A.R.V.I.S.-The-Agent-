import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  MessageSquare,
  Mic,
  Presentation,
  Scissors,
  ShieldCheck,
  Sparkles,
  Video,
  Wifi,
} from 'lucide-react';

const services = [
  { label: 'AI Chat', detail: 'Ask anything', icon: MessageSquare, path: '/chat', tone: 'blue' },
  { label: 'Image Studio', detail: 'Create visuals', icon: ImageIcon, path: '/ai-image-generation', tone: 'violet' },
  { label: 'Video Studio', detail: 'Bring ideas alive', icon: Video, path: '/ai-video-generation', tone: 'rose' },
  { label: 'Virtual Robot', detail: 'Talk with Titan', icon: Bot, path: '/virtual-robot', tone: 'cyan' },
  { label: 'Resume AI', detail: 'Polish your story', icon: FileText, path: '/resume-analysis', tone: 'emerald' },
  { label: 'Interview', detail: 'Practice smarter', icon: BriefcaseBusiness, path: '/interview-prep', tone: 'amber' },
  { label: 'Prompt Lab', detail: 'Build better prompts', icon: Lightbulb, path: '/prompt-generator', tone: 'orange' },
  { label: 'PPT Maker', detail: 'Present beautifully', icon: Presentation, path: '/ppt-maker', tone: 'sky' },
  { label: 'Video Edit', detail: 'Shape your story', icon: Scissors, path: '/video-editor', tone: 'pink' },
];

const TitanRobotAdvanced = lazy(() => import('@/components/TitanRobotAdvanced'));

function Monogram() {
  return (
    <div className="brand-mark" aria-label="JARVIS">
      <span>J</span>
    </div>
  );
}

function GlassButton({ children, onClick, primary = false }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} className={`glass-button ${primary ? 'glass-button-primary' : ''}`}>
      {children}
    </button>
  );
}

function RobotVisual() {
  return (
    <div className="robot-visual" aria-label="JARVIS Hulkbuster robot" role="img">
      <Suspense fallback={<div className="h-full min-h-[280px] animate-pulse rounded-3xl bg-cyan-400/5" />}>
        <TitanRobotAdvanced emotion="neutral" />
      </Suspense>
    </div>
  );
}

export default function HomePageCircular() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="jarvis-home">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      <header className="glass-nav">
        <div className="flex items-center gap-3">
          <Monogram />
          <div>
            <p className="brand-name">J.A.R.V.I.S</p>
            <p className="brand-subtitle">Personal intelligence system</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="system-pill"><span className="online-dot" /> Online</div>
          <span className="clock hidden sm:inline">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button className="icon-glass-button hidden sm:flex" onClick={() => navigate('/settings')} aria-label="Settings">
            <ShieldCheck size={17} />
          </button>
        </div>
      </header>

      <main className="home-content">
        <section className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> Your command center</p>
          <h1>Good evening, <span>Commander.</span></h1>
          <p className="hero-description">Everything you need, quietly organized in one intelligent workspace.</p>
        </section>

        <section className="hero-grid">
          <div className="glass-panel welcome-panel">
            <RobotVisual />
            <div className="welcome-copy">
              <p className="panel-kicker">Core intelligence</p>
              <h2>How can I help?</h2>
              <p>Start a conversation or jump into one of your creative tools.</p>
              <div className="hero-actions">
                <GlassButton primary onClick={() => navigate('/chat')}><Mic size={16} /> Start speaking</GlassButton>
                <GlassButton onClick={() => navigate('/services-hub')}>Explore tools <ArrowUpRight size={15} /></GlassButton>
              </div>
            </div>
          </div>

          <aside className="glass-panel status-panel">
            <div className="panel-heading"><span>System status</span><Wifi size={16} /></div>
            <div className="status-main"><span className="online-dot large" /><div><strong>All systems operational</strong><small>Last checked just now</small></div></div>
            <div className="metric-list">
              <div><span>Neural engine</span><b>Ready</b></div>
              <div><span>Voice response</span><b>Active</b></div>
              <div><span>Secure connection</span><b>Protected</b></div>
            </div>
            <button className="text-link" onClick={() => navigate('/dashboard')}>View diagnostics <ArrowUpRight size={14} /></button>
          </aside>
        </section>

        <section className="tools-section">
          <div className="section-heading"><div><p className="panel-kicker">Capabilities</p><h2>Made for your momentum</h2></div><span className="tool-count">09 tools</span></div>
          <div className="service-grid">
            {services.map(({ label, detail, icon: Icon, path, tone }) => (
              <button key={path} className={`service-card tone-${tone}`} onClick={() => navigate(path)}>
                <span className="service-icon"><Icon size={19} /></span>
                <span className="service-text"><strong>{label}</strong><small>{detail}</small></span>
                <ArrowUpRight className="service-arrow" size={16} />
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer"><span>J.A.R.V.I.S · v1.2</span><span>Designed for focus, built for you</span></footer>
    </div>
  );
}
