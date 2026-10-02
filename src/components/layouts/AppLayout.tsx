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
  Cpu,
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
  const { threads, currentThread, createNewThread, selectThread } = useChatHistory();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    toast.success('Session terminated');
  };

  const handleNewThread = async () => {
    await createNewThread();
    navigate('/chat');
    setSidebarOpen(false);
    toast.success('New session initialized');
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
    <div className="app-shell flex h-screen overflow-hidden bg-[#020810]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-[270px] flex flex-col transition-transform duration-300
          glass-sidebar border-r border-[#00c8ff15] ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Scan lines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,255,0.02) 3px, rgba(0,200,255,0.02) 6px)',
          }}
        />

        {/* Header */}
        <div className="relative p-4 border-b border-[#00c8ff15]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center arc-glow-sm">
                <Cpu className="w-4 h-4 text-white" />
                <div className="absolute inset-[-2px] rounded-full border border-dashed border-[#00c8ff40] animate-hud-spin" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-[0.2em] uppercase jarvis-gradient-text">
                  J.A.R.V.I.S
                </span>
                <p className="text-[8px] tracking-[0.25em] text-[#00c8ff50] uppercase leading-none">
                  AI Interface
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#00c8ff80] hover:text-[#00c8ff] hover:bg-[#00c8ff10]"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* New chat */}
          <Button
            onClick={handleNewThread}
            className="w-full rounded-lg bg-gradient-to-r from-[#00c8ff18] to-[#0050a018] border border-[#00c8ff30] text-[#00c8ff] hover:from-[#00c8ff25] hover:to-[#0050a025] hover:border-[#00c8ff60] transition-all font-semibold tracking-wider uppercase text-xs h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            New Session
          </Button>
        </div>

        {/* Thread history */}
        <ScrollArea className="flex-1 px-2 py-3">
          {threads.length > 0 ? (
            <div className="space-y-1">
              <div className="px-2 py-1.5">
                <h3 className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#00c8ff50]">
                  Recent Sessions
                </h3>
              </div>
              {threads.slice(0, 20).map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={`group w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    currentThread?.id === thread.id
                      ? 'bg-[#00c8ff12] border border-[#00c8ff30] text-white'
                      : 'text-white/50 hover:bg-[#00c8ff08] hover:border hover:border-[#00c8ff15] hover:text-white/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#00c8ff60]" />
                    <span className="text-xs truncate flex-1">{thread.title}</span>
                  </div>
                  <span className="text-[9px] text-[#00c8ff40] mt-0.5 block pl-5">
                    {formatDate(thread.updated_at)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-10 text-center">
              <Clock className="w-8 h-8 text-[#00c8ff30] mx-auto mb-2" />
              <p className="text-xs text-[#00c8ff50] tracking-widest uppercase">No sessions yet</p>
            </div>
          )}
        </ScrollArea>

        {/* User profile */}
        <div className="relative p-3 border-t border-[#00c8ff15]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#00c8ff08] hover:border hover:border-[#00c8ff20] border border-transparent transition-all">
                <Avatar className="h-8 w-8 border border-[#00c8ff40]">
                  <AvatarFallback className="bg-gradient-to-br from-[#00c8ff] to-[#0050a0] text-white text-xs font-bold">
                    {profile?.username?.[0]?.toUpperCase() || 'J'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate tracking-wide">
                    {profile?.username || 'Agent'}
                  </p>
                  <p className="text-[9px] text-[#00c8ff50] truncate tracking-wider">
                    {profile?.email || 'agent@jarvis.ai'}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-52 bg-[#00050f] border border-[#00c8ff25] text-white/80"
            >
              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="cursor-pointer hover:bg-[#00c8ff12] hover:text-white focus:bg-[#00c8ff12]"
              >
                <User className="mr-2 h-4 w-4 text-[#00c8ff]" />
                Profile
              </DropdownMenuItem>
              {profile?.role === 'admin' && (
                <DropdownMenuItem
                  onClick={() => navigate('/admin')}
                  className="cursor-pointer hover:bg-[#00c8ff12] hover:text-white focus:bg-[#00c8ff12]"
                >
                  <Shield className="mr-2 h-4 w-4 text-[#00c8ff]" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => navigate('/settings')}
                className="cursor-pointer hover:bg-[#00c8ff12] hover:text-white focus:bg-[#00c8ff12]"
              >
                <Settings className="mr-2 h-4 w-4 text-[#00c8ff]" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#00c8ff15]" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-red-950/30 text-red-400 focus:bg-red-950/30 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="glass-topbar lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[#00c8ff15] bg-[#00050f]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-[#00c8ff80] hover:text-[#00c8ff] hover:bg-[#00c8ff10]"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="text-sm font-bold tracking-[0.2em] uppercase jarvis-gradient-text">
            J.A.R.V.I.S
          </span>
        </div>

        {/* Page content */}
        <div className="app-content flex-1 overflow-hidden bg-[#020810]">
          {children}
        </div>
      </main>

      <IOSControlPanel />
    </div>
  );
}
