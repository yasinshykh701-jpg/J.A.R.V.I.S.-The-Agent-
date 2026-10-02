import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Image as ImageIcon, 
  Video,
  Bot, 
  Briefcase,
  UserCheck,
  FolderOpen,
  Plus,
  User,
  Key,
  Settings,
  CreditCard,
  Search,
  Bell,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const mainMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'chat', name: 'AI Chat', icon: MessageSquare, path: '/home' },
    { id: 'image', name: 'Image Generator', icon: ImageIcon, path: '/image-generation' },
    { id: 'video', name: 'Video Generator', icon: Video, path: '/video-generation' },
    { id: 'robot', name: 'Virtual Robot', icon: Bot, path: '/virtual-robot' },
    { id: 'resume', name: 'Resume Analyzer', icon: Briefcase, path: '/resume-analysis' },
    { id: 'interview', name: 'Interview Robot', icon: UserCheck, path: '/interview-prep' },
  ];

  const settingsItems = [
    { id: 'account', name: 'Account', icon: User, path: '/profile' },
    { id: 'api', name: 'API Keys', icon: Key, path: '/api-keys' },
    { id: 'preferences', name: 'Preferences', icon: Settings, path: '/preferences' },
    { id: 'billing', name: 'Billing', icon: CreditCard, path: '/billing' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#020810] overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold">JARVIS AI</span>
          </div>
        </div>
        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Main Menu</p>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={2} />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Projects Section */}
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Projects</p>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                <FolderOpen className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">Recent Project 1</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                <FolderOpen className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">Recent Project 2</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all">
                <Plus className="w-5 h-5" strokeWidth={2} />
                <span className="font-medium">New Project</span>
              </button>
            </nav>
          </div>
        </div>
        {/* Settings at Bottom */}

      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#0a0f1a] border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-6">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#0a0f1a]">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#0a0f1a]">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </Button>
              <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-gray-200 hover:ring-blue-500 transition-all" onClick={() => navigate('/profile')}>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
