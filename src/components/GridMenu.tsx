import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Image as ImageIcon,
  Video,
  Bot,
  FileText,
  Briefcase,
  Lightbulb,
  FileSpreadsheet,
  Scissors,
  ChevronRight,
  Cpu,
} from 'lucide-react';

interface GridMenuItem {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  color: string;
  glow: string;
}

const menuItems: GridMenuItem[] = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Intelligent multi-turn conversation with JARVIS.',
    path: '/chat',
    color: '#00c8ff',
    glow: 'rgba(0,200,255,0.15)',
  },
  {
    icon: ImageIcon,
    title: 'Image Generation',
    description: 'Create stunning visuals from text prompts.',
    path: '/ai-image-generation',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: Video,
    title: 'Video Generation',
    description: 'Generate AI-powered cinematic video clips.',
    path: '/video-generation',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.15)',
  },
  {
    icon: Bot,
    title: 'Virtual Robot',
    description: 'Talk directly with the JARVIS 3D unit.',
    path: '/virtual-robot',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.15)',
  },
  {
    icon: FileText,
    title: 'Resume Analysis',
    description: 'AI-powered resume review and optimization.',
    path: '/resume-analysis',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.15)',
  },
  {
    icon: Briefcase,
    title: 'Interview Prep',
    description: 'Practice with an AI technical interviewer.',
    path: '/interview-prep',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.15)',
  },
  {
    icon: Lightbulb,
    title: 'Prompt Generator',
    description: 'Craft perfect prompts for any AI model.',
    path: '/prompt-generator',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.15)',
  },
  {
    icon: FileSpreadsheet,
    title: 'PPT Maker',
    description: 'Generate professional presentations instantly.',
    path: '/ppt-maker',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.15)',
  },
  {
    icon: Scissors,
    title: 'Video Editor',
    description: 'AI-assisted video editing and enhancement.',
    path: '/video-editor',
    color: '#e879f9',
    glow: 'rgba(232,121,249,0.15)',
  },
];

export default function GridMenu() {
  const navigate = useNavigate();

  return (
    <div className="w-full py-4">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#00c8ff] to-transparent" />
        <p className="text-[9px] tracking-[0.4em] text-[#00c8ff70] uppercase">
          JARVIS · Active Modules
        </p>
        <div className="flex-1 h-px bg-gradient-to-r from-[#00c8ff20] to-transparent" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group relative p-5 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                background: '#00050f',
                border: `1px solid ${item.color}22`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${item.color}55`;
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 24px ${item.glow}, 0 0 0 1px ${item.color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${item.color}22`;
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-0 group-hover:opacity-60 transition-opacity" style={{ borderColor: item.color }} />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-0 group-hover:opacity-60 transition-opacity" style={{ borderColor: item.color }} />

              {/* Background glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"
                style={{ background: item.glow }}
              />

              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.color}12`,
                    border: `1px solid ${item.color}35`,
                  }}
                >
                  <Icon className="w-6 h-6 transition-colors" style={{ color: item.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-sm font-bold tracking-wider text-white/90 uppercase mb-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  className="w-4 h-4 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0"
                  style={{ color: item.color }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Free tier banner */}
      <div className="mt-8 p-5 rounded-xl border border-[#00c8ff20] bg-[#00050f] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00c8ff08] via-transparent to-[#5566ff08]" />
        <div className="relative flex items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center">
            <Cpu className="w-3 h-3 text-white" />
          </div>
          <p className="text-sm font-bold tracking-[0.2em] uppercase jarvis-gradient-text">
            All Modules · Lifetime Free · Unlimited Access
          </p>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center">
            <Cpu className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
