import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Bot, 
  Briefcase, 
  UserCheck,
  Sparkles,
  FileText,
  ArrowRight
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import { voiceFeedback } from '@/services/voiceFeedback';

export default function DashboardPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: 'chat',
      name: 'AI Chat',
      description: 'Have intelligent conversations with AI',
      icon: MessageSquare,
      gradient: 'gradient-blue',
      path: '/chat'
    },
    {
      id: 'image',
      name: 'Image Generator',
      description: 'Create stunning images with AI',
      icon: ImageIcon,
      gradient: 'gradient-purple',
      path: '/image-generation'
    },
    {
      id: 'video',
      name: 'Video Generator',
      description: 'Generate videos from text or images',
      icon: Video,
      gradient: 'gradient-pink',
      path: '/video-generation'
    },
    {
      id: 'robot',
      name: 'Virtual Robot',
      description: 'Interact with 3D AI robot assistant',
      icon: Bot,
      gradient: 'gradient-cyan',
      path: '/virtual-robot'
    },
    {
      id: 'resume',
      name: 'Resume Analyzer',
      description: 'Get AI feedback on your resume',
      icon: Briefcase,
      gradient: 'gradient-green',
      path: '/resume-analysis'
    },
    {
      id: 'interview',
      name: 'Interview Robot',
      description: 'Practice interviews with AI',
      icon: UserCheck,
      gradient: 'gradient-orange',
      path: '/interview-prep'
    },
    {
      id: 'prompt',
      name: 'Prompt Generator',
      description: 'Generate optimized AI prompts',
      icon: Sparkles,
      gradient: 'gradient-yellow',
      path: '/prompt-generator'
    },
    {
      id: 'notes',
      name: 'Note Summary',
      description: 'Summarize documents with AI',
      icon: FileText,
      gradient: 'gradient-teal',
      path: '/note-summary'
    },
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    voiceFeedback.featureSelected(feature.name);
    navigate(feature.path);
  };

  return (
    <AppLayout>
      <div className="h-full overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Qazyen AI</h1>
            <p className="text-lg text-gray-600">
              Your AI-powered assistant platform with multiple intelligent tools
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${feature.gradient} rounded-2xl flex items-center justify-center icon-container`}>
                    <feature.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">Total Features</p>
              <p className="text-3xl font-bold text-blue-900">6</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <p className="text-sm text-purple-700 font-medium mb-1">AI Models</p>
              <p className="text-3xl font-bold text-purple-900">4+</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <p className="text-sm text-pink-700 font-medium mb-1">Unlimited Access</p>
              <p className="text-3xl font-bold text-pink-900">Free</p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
