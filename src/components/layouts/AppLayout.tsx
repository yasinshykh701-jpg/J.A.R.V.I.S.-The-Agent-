import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquare,
  Plus,
  Clock,
  Settings,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/contexts/ChatHistoryContext';
import { toast } from 'sonner';
import IOSControlPanel from '@/components/IOSControlPanel';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { threads, currentThread, createNewThread, selectThread, deleteThreadById } = useChatHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleNewThread = async () => {
    await createNewThread();
    navigate('/chat');
    setSidebarOpen(false);
    toast.success('New conversation started');
  };

  const handleSelectThread = async (threadId: string) => {
    await selectThread(threadId);
    navigate('/chat');
    setSidebarOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqp58hxu680.jpg)]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar - Google Studio Style */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-[280px] bg-background border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alrn5v0ilerk.jpg)]">
          <div className="flex items-center justify-between mb-4 rounded-[20px] bg-cover bg-center bg-no-repeat bg-[#060505] bg-none">
            <div className="flex items-center gap-2">

              <h1 className="font-medium qazyen-gradient-text Pro Text'] Pro Text'] font-['MF-b09bb18e300fbc3fa8af0aeb95295328'] text-[52px] text-[#0e0202] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-akwegxghyeps.png)]">{""}</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={handleNewThread}
            className="w-full hover:bg-primary/90 text-primary-foreground rounded-full google-shadow bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-adxbss9duzgg.jpg)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-2 py-4 border-solid bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-ah7f4pma1tz4.jpg)] border-[#1d1919] rounded-[25px] border-[1.62162px] border-[#1d1919]">
          {threads.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 border-solid bg-cover bg-center bg-no-repeat border-[#7e6e6e] border-[0px] bg-[#0a090900] bg-none border-[#7e6e6e]">
                <h3 className="text-xs font-medium uppercase tracking-wider text-[#1e1a1a]">
                  Recent
                </h3>
              </div>
              {threads.slice(0, 20).map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={`group w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentThread?.id === thread.id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate flex-1 border-solid border-[4.32432px] border-[#f1fcfc] rounded-[10px] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-als8csaqfytc.jpg)]">{thread.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block pl-6 bg-cover bg-center bg-no-repeat bg-[transparent00] bg-none">
                    {formatDate(thread.updated_at)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
            </div>
          )}
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-border bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-af64iwkswlc0.jpg)]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {profile?.username?.[0]?.toUpperCase() || 'Q'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {profile?.username || 'Guest'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email || 'guest@qazyen.ai'}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {profile?.role === 'admin' && (
                <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Mobile */}

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
      {/* iOS Control Panel */}
      <IOSControlPanel />
    </div>
  );
}
