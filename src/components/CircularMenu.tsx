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
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface CircularMenuItem {
  icon: React.ElementType;
  title: string;
  path: string;
  color: string;
}

const menuItems: CircularMenuItem[] = [
  { icon: MessageSquare, title: 'Chat', path: '/chat', color: 'linear-gradient(135deg, #E0FFFF 0%, #00FFFF 100%)' },
  { icon: ImageIcon, title: 'AI Image', path: '/ai-image-generation', color: 'linear-gradient(135deg, #00FFFF 0%, #1E90FF 100%)' },
  { icon: Video, title: 'AI Video', path: '/ai-video-generation', color: 'linear-gradient(135deg, #1E90FF 0%, #87CEEB 100%)' },
  { icon: Bot, title: 'Virtual Robot', path: '/virtual-robot', color: 'linear-gradient(135deg, #87CEEB 0%, #FFFFFF 100%)' },
  { icon: FileText, title: 'Resume', path: '/resume-analysis', color: 'linear-gradient(135deg, #FFFFFF 0%, #00008B 100%)' },
  { icon: Briefcase, title: 'Interview', path: '/interview-prep', color: 'linear-gradient(135deg, #00008B 0%, #C0C0C0 100%)' },
  { icon: Lightbulb, title: 'Prompts', path: '/prompt-generator', color: 'linear-gradient(135deg, #C0C0C0 0%, #000000 100%)' },
  { icon: FileSpreadsheet, title: 'PPT Maker', path: '/ppt-maker', color: 'linear-gradient(135deg, #000000 0%, #E0FFFF 100%)' },
  { icon: Scissors, title: 'Video Edit', path: '/video-editor', color: 'linear-gradient(135deg, #E0FFFF 0%, #00FFFF 100%)' },
];

export default function CircularMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const radius = 180; // Radius of the circle
  const centerX = 0;
  const centerY = 0;
  
  // Calculate position for each button in a circle
  const getButtonPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div 
      className="relative w-full h-full min-h-[600px] flex items-center justify-center border-none border-[5px] rounded-[400px] border-[rgb(0,4,8)] bg-cover bg-center bg-no-repeat bg-[#00040800] bg-none"
      style={{
        backgroundColor: '#000000fa',
        backgroundImage: 'none'
      }}
    >
      {/* Circular button layout */}
      <div className="relative w-[500px] h-[500px] border-solid rounded-[340px] border-[#000000] border-[5px] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aln6da4aheyo.png)] border-[rgb(0,0,0)]">
        {menuItems.map((item, index) => {
          const { x, y } = getButtonPosition(index, menuItems.length);
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="circular-button absolute w-16 h-16 flex items-center justify-center shadow-lg border-solid rounded-[340px] border-[3.24324px] border-[#e3e8ef] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aln14axq3vgg.jpg)]"
              style={{
                left: `calc(50% + ${x}px - 32px)`,
                top: `calc(50% + ${y}px - 32px)`,
                background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}CC 100%)`,
                backdropFilter: 'blur(10px)',
              }}
              title={item.title}
            >
              <Icon className="w-7 h-7 text-white" />
            </button>
          );
        })}
        {/* Center iOS Notch - User Profile Panel (Uppest Position - Top of Page) */}

        {/* Center title text */}
        <div className="absolute left-1/2 top-[calc(50%-120px)] transform -translate-x-1/2 text-center">

          <p className="text-white/90 text-sm mt-1">
            Your AI Companion
          </p>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-pink-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-24 h-24 rounded-full bg-blue-400/20 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
