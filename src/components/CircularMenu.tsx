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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CircularMenuItem {
  icon: React.ElementType;
  title: string;
  path: string;
  color: string;       // icon accent colour
  glow: string;        // glow rgba
}

const menuItems: CircularMenuItem[] = [
  { icon: MessageSquare, title: 'Chat',          path: '/chat',               color: '#00c8ff', glow: 'rgba(0,200,255,0.5)' },
  { icon: ImageIcon,     title: 'AI Image',      path: '/ai-image-generation', color: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
  { icon: Video,         title: 'AI Video',      path: '/ai-video-generation', color: '#f43f5e', glow: 'rgba(244,63,94,0.5)' },
  { icon: Bot,           title: 'Robot',         path: '/virtual-robot',       color: '#22d3ee', glow: 'rgba(34,211,238,0.5)' },
  { icon: FileText,      title: 'Resume',        path: '/resume-analysis',     color: '#4ade80', glow: 'rgba(74,222,128,0.5)' },
  { icon: Briefcase,     title: 'Interview',     path: '/interview-prep',      color: '#fbbf24', glow: 'rgba(251,191,36,0.5)' },
  { icon: Lightbulb,     title: 'Prompts',       path: '/prompt-generator',    color: '#fb923c', glow: 'rgba(251,146,60,0.5)' },
  { icon: FileSpreadsheet, title: 'PPT Maker',   path: '/ppt-maker',           color: '#38bdf8', glow: 'rgba(56,189,248,0.5)' },
  { icon: Scissors,      title: 'Video Edit',    path: '/video-editor',        color: '#e879f9', glow: 'rgba(232,121,249,0.5)' },
];

export default function CircularMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const radius = 175; // px — orbit radius

  const getButtonPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  };

  return (
    <div className="relative w-full min-h-[440px] flex items-center justify-center">
      {/* Outer HUD orbit ring */}
      <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-[#00c8ff20] animate-hud-spin-slow pointer-events-none" />
      {/* Inner ring */}
      <div className="absolute w-[280px] h-[280px] rounded-full border border-[#00c8ff15] pointer-events-none" />

      {/* Button orbit */}
      <div className="relative w-[420px] h-[420px]">
        {menuItems.map((item, index) => {
          const { x, y } = getButtonPosition(index, menuItems.length);
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="absolute flex flex-col items-center gap-1 group"
              style={{
                left: `calc(50% + ${x}px - 32px)`,
                top:  `calc(50% + ${y}px - 32px)`,
                width: 64,
              }}
              title={item.title}
            >
              {/* Icon disc */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${item.color}22, #00050f 70%)`,
                  border: `1.5px solid ${item.color}50`,
                  boxShadow: `0 0 0 transparent`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    `0 0 18px ${item.glow}, 0 0 36px ${item.glow}55`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 transparent';
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}50`;
                }}
              >
                <Icon className="w-6 h-6 transition-colors" style={{ color: item.color }} />
              </div>
              {/* Label */}
              <span
                className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ color: item.color }}
              >
                {item.title}
              </span>
            </button>
          );
        })}

        {/* Center piece */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          {/* Arc reactor core */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00c8ff30] to-[#002040] border-2 border-[#00c8ff60] arc-glow" />
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#00c8ff20] to-[#001428] border border-[#00c8ff40]" />
            <div className="absolute inset-[12px] rounded-full bg-[#00c8ff] opacity-80 animate-arc-pulse" />
            {/* Spinning outer ring */}
            <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#00c8ff40] animate-hud-spin" />
          </div>
          <p className="text-[8px] tracking-[0.35em] text-[#00c8ff80] uppercase">
            {user ? user.email?.split('@')[0] ?? 'Agent' : 'JARVIS'}
          </p>
        </div>
      </div>

      {/* Ambient glow particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        <div className="absolute top-8 left-12 w-16 h-16 rounded-full bg-[#00c8ff] opacity-5 blur-2xl animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute bottom-8 right-12 w-24 h-24 rounded-full bg-[#5566ff] opacity-5 blur-3xl animate-[pulse_4s_ease-in-out_infinite_1s]" />
      </div>
    </div>
  );
}
