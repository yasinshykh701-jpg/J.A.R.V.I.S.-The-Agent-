import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
  Sparkles
} from 'lucide-react';

interface GridMenuItem {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  gradient: string;
}

const menuItems: GridMenuItem[] = [
  { 
    icon: MessageSquare, 
    title: 'AI Chat', 
    description: 'Intelligent conversation assistant',
    path: '/chat', 
    gradient: 'from-cyan-400 to-cyan-600' 
  },
  { 
    icon: ImageIcon, 
    title: 'Image Generation', 
    description: 'Create stunning AI images',
    path: '/image-generation', 
    gradient: 'from-blue-400 to-blue-600' 
  },
  { 
    icon: Video, 
    title: 'Video Generation', 
    description: 'Generate AI-powered videos',
    path: '/video-generation', 
    gradient: 'from-pink-400 to-pink-600' 
  },
  { 
    icon: Bot, 
    title: 'Virtual Robot', 
    description: 'Talk with Titan robot',
    path: '/virtual-robot', 
    gradient: 'from-cyan-400 to-cyan-600' 
  },
  { 
    icon: FileText, 
    title: 'Resume Analysis', 
    description: 'AI-powered resume review',
    path: '/resume-analysis', 
    gradient: 'from-blue-400 to-blue-600' 
  },
  { 
    icon: Briefcase, 
    title: 'Interview Prep', 
    description: 'Practice with AI interviewer',
    path: '/interview-prep', 
    gradient: 'from-pink-400 to-pink-600' 
  },
  { 
    icon: Lightbulb, 
    title: 'Prompt Generator', 
    description: 'Create perfect AI prompts',
    path: '/prompt-generator', 
    gradient: 'from-indigo-400 to-indigo-600' 
  },
  { 
    icon: FileSpreadsheet, 
    title: 'PPT Maker', 
    description: 'Generate presentations',
    path: '/ppt-maker', 
    gradient: 'from-cyan-400 to-cyan-600' 
  },
  { 
    icon: Scissors, 
    title: 'Video Editor', 
    description: 'Edit videos with AI',
    path: '/video-editor', 
    gradient: 'from-blue-400 to-blue-600' 
  },
];

export default function GridMenu() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Card
              key={item.path}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 dark:bg-gray-800/90 backdrop-blur-md border-white/20 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agt0ho1j9j40.jpg)] rounded-[120px] border-[1.62162px] border-dashed border-[rgba(255,255,255,0.2)]"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Lifetime Free Banner */}
      <Card className="mt-8 from-cyan-500/10 via-pink-500/10 to-blue-500/10 border-2 border-cyan-400/30 rounded-[20px] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agt0ho1j9j40.jpg)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <p className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              All Features • Lifetime Free • Unlimited Use
            </p>
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
