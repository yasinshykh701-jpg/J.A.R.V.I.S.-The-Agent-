import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  Video, 
  Mic, 
  FileText, 
  Presentation, 
  Scissors,
  Edit3,
  UserCheck,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  Moon,
  Sun,
  Infinity,
  Settings as SettingsIcon,
  Grid3x3,
  Circle
} from 'lucide-react';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import CircularMenu from '@/components/CircularMenu';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useTheme } from '@/components/theme-provider';

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'circular'>('circular'); // Default to circular
  const { theme, setTheme } = useTheme();

  const features: FeatureCard[] = [
    {
      icon: ImageIcon,
      title: 'Image Generation',
      description: 'Create stunning images',
      path: '/ai-image-generation'
    },
    {
      icon: Video,
      title: 'Video Generation',
      description: 'Generate videos',
      path: '/video-generation'
    },
    {
      icon: Mic,
      title: 'Voice Assistant',
      description: '46 languages',
      path: '/virtual-robot'
    },
    {
      icon: FileText,
      title: 'Notes Summary',
      description: 'Summarize notes',
      path: '/note-summary'
    },
    {
      icon: Presentation,
      title: 'PPT Maker',
      description: 'Create presentations',
      path: '/ppt-maker'
    },
    {
      icon: Scissors,
      title: 'Video Editor',
      description: 'Edit videos',
      path: '/video-editor'
    },
    {
      icon: Edit3,
      title: 'Photo Editor',
      description: 'Edit photos',
      path: '/ai-image-generation'
    },
    {
      icon: UserCheck,
      title: 'Interview Mode',
      description: 'Practice interviews',
      path: '/interview-prep'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Smart conversations',
      path: '/chat'
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/chat', { state: { query: searchQuery } });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative">
      {/* Dark Mode Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-12 h-12 rounded-full dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-900" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </Button>
      </div>
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Side - Robot Section */}
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-[20px]">
              <CardContent className="p-8">
                {/* Titan Robot 3D */}
                <div className="w-full h-[520px] mb-6">
                  <ErrorBoundary
                    fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🤖</div>
                          <p className="text-muted-foreground">Titan Robot</p>
                        </div>
                      </div>
                    }
                  >
                    <TitanRobotAdvanced isListening={false} emotion="neutral" />
                  </ErrorBoundary>
                </div>

                {/* Meet Titan Section */}
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold dark:text-white text-[#d1dcf3]">{"Meet Titan"}</h2>
                  <p className="text-sm dark:text-gray-400 text-[#e6e6f3]">
                    Heavy combat war robot with massive armor plating, bulky proportions, and military-grade construction
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center pt-4">
                    <Button
                      onClick={() => navigate('/interview-prep')}
                      className="hover:bg-primary/90 px-6 py-2 rounded-lg font-medium text-[#0f0d0d]"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Interview
                    </Button>
                    <Button
                      onClick={() => navigate('/virtual-robot')}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg font-medium"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Voice Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Features Section */}
          <div className="space-y-6 rounded-[20px]">
            {/* Free Services Banner */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-4 rounded-[20px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg icon-gradient-blue">
                      <Infinity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#000000]">Lifetime Free & Unlimited</h3>
                      <p className="text-xs border-solid border-[#231414] border-[0px] text-[#0d0b0b] border-[#231414]">All AI services are 100% free forever</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="shrink-0 btn-gradient-purple"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Header */}
            <div className="text-center lg:text-left space-y-2 border-solid border-[rgb(0,0,0)] rounded-[20px] border-[5px] border-[rgb(0,0,0)]">
              <h1 className="text-4xl font-bold dark:text-white Pro SC'] font-['MF-f0763b1188a38fbccf16e7fb9c79794c'] text-[#ffffff]">
                JARVIS AI
              </h1>
              <p className="dark:text-gray-400 text-sm font-['MF-161c1cccba2988a536baab22d5bf4334'] text-[#18212f]">
                Your intelligent AI companion for creativity, productivity, and conversation
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 px-4 py-3 shadow-sm border-solid rounded-[20px] border-[1.08108px] border-[#230d23]">
                <Paperclip className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ask JARVIS anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white placeholder:text-gray-400 border-solid rounded-[20px] border-[1.08108px] border-[#230d23]"
                />
                <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/virtual-robot')} />
                <Button
                  onClick={handleSearch}
                  size="icon"
                  className="btn-gradient-blue rounded-full w-8 h-8"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                // Assign gradient colors based on index
                const gradients = [
                  'icon-gradient-blue',
                  'icon-gradient-pink', 
                  'icon-gradient-green',
                  'icon-gradient-orange',
                  'icon-gradient-purple',
                  'icon-gradient-red',
                  'icon-gradient-yellow',
                  'icon-gradient-teal'
                ];
                const gradientClass = gradients[index % gradients.length];
                
                return (
                  <Card
                    key={index}
                    className="bg-[#0a0f1a] border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate(feature.path)}
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className={`w-12 h-12 rounded-lg ${gradientClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <feature.icon 
                          className="w-6 h-6 text-white"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Lifetime Free Banner */}
            <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold text-sm text-[#f5efef]">
                    All Features Lifetime Free
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
