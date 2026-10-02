import { Logo } from './components/Logo';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { AnimatePresence } from 'motion/react';
import { SearchPage } from './components/SearchPage';
import { CreatePage } from './components/CreatePage';
import { MessagesPage } from './components/MessagesPage';
import { TikTokFeed } from './components/TikTokFeed';
import { ProfilePage } from './components/ProfilePage';
import { AuthPage } from './components/AuthPage';
import { DatabaseConsole } from './components/DatabaseConsole';
import { Sidebar, TabType } from './components/Sidebar';
import { InputBox } from './components/InputBox';
import { UserSettingsMenu } from './components/UserSettingsMenu';
import { VirtualCommunication } from './components/VirtualCommunication';
import { PythonExecution } from './components/PythonExecution';
import { WallpaperMenu } from './components/WallpaperMenu';
import { VpnModal, VPN_NODES, VpnNode } from './components/VpnModal';
import { VpnBadge } from './components/VpnBadge';
import { CapCutEditorModal } from './components/CapCutEditorModal';
import { Home, Play, Heart, MessageSquare, Share2, Music, EyeOff, ArrowRight, UserCircle, History, PlusSquare, Search, Plus, Users, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('app_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    signInAnonymously(auth).catch(() => {
      // Ignore auth error in preview
    });
  }, []);

  const [siteModal, setSiteModal] = useState<{url: string, title: string} | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('Puck');
  const [hasSentPrompt, setHasSentPrompt] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    return localStorage.getItem('app_focus_mode') === 'true';
  });
  
  const [customWallpapers, setCustomWallpapers] = useState<any[]>([]);
  const [currentWallpaperId, setCurrentWallpaperId] = useState<string>(() => {
    return localStorage.getItem('app_current_wallpaper_id') || 'nature_live';
  });
  const [isWallpaperMenuOpen, setIsWallpaperMenuOpen] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('app_accent_color') || '#FF3B30';
  });

  // Free VPN State
  const [isVpnOpen, setIsVpnOpen] = useState(false);
  const [isVpnConnected, setIsVpnConnected] = useState(true);
  const [selectedVpnNode, setSelectedVpnNode] = useState<VpnNode>(VPN_NODES[0]);

  // CapCut Editor State
  const [isCapCutOpen, setIsCapCutOpen] = useState(false);
  const [capCutVideoUrl, setCapCutVideoUrl] = useState<string | undefined>(undefined);
  const [capCutVideoTitle, setCapCutVideoTitle] = useState<string | undefined>(undefined);

  const [backendUser, setBackendUser] = useState<any>(() => {
    const saved = localStorage.getItem('backend_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleOpenCapCut = (url?: string, title?: string) => {
    setCapCutVideoUrl(url);
    setCapCutVideoTitle(title);
    setIsCapCutOpen(true);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor);
    localStorage.setItem('app_accent_color', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('app_focus_mode', String(isFocusMode));
  }, [isFocusMode]);

  useEffect(() => {
    localStorage.setItem('app_current_wallpaper_id', currentWallpaperId);
  }, [currentWallpaperId]);

  useEffect(() => {
    const loadCustom = async () => {
      try {
        const { getAllWallpapers } = await import('./lib/wallpaperDb');
        const stored = await getAllWallpapers();
        const customItems = stored.map(item => ({
          id: item.id,
          url: URL.createObjectURL(item.blob),
          type: item.type,
          label: item.label,
          isCustom: true
        }));
        setCustomWallpapers(customItems);
      } catch (err) {
        console.error('Failed to load custom wallpapers:', err);
      }
    };
    loadCustom();
  }, []);

  const PRESET_WALLPAPERS = [
    { 
      id: 'nature_live', 
      url: '/nature.mp4', 
      fallbackUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4', 
      type: 'video', 
      label: 'Nature Live 🌿' 
    },
    { 
      id: 'nature_waterfall', 
      url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4', 
      type: 'video', 
      label: 'Forest Waterfall 🌊' 
    },
    { id: 'sunflower1', url: '/sunflowers_summer_sky.jpg', type: 'image', label: 'Sunflowers Sky' },
    { id: 'uploaded1', url: '/uploaded.png', type: 'image', label: 'My Wallpaper' },
    { id: 'video1', url: '/bg-video.mp4', type: 'video', label: 'Space Nexus' },
    { id: 'video2', url: '/kungfu panda 3.mp4', type: 'video', label: 'Kung Fu Panda' },
    { id: 'img1', url: '/assets/glassy_silver_border_1784308009261-BBthVwCs.jpg', type: 'image', label: 'Glassy Silver' },
  ];

  const allWallpapers = [...PRESET_WALLPAPERS, ...customWallpapers];
  const activeWallpaper = allWallpapers.find(w => w.id === currentWallpaperId) || PRESET_WALLPAPERS[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return <SearchPage />;
      case 'reel':
        return (
          <div className="flex-1 w-full h-full">
            <TikTokFeed 
              onOpenVpn={() => setIsVpnOpen(true)} 
              isVpnConnected={isVpnConnected} 
              onOpenCapCut={handleOpenCapCut}
            />
          </div>
        );
      case 'history':
        return (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-ink/70">
            <h2 className="text-3xl font-display text-white">Chat History</h2>
            <p>Your previous conversations will appear here.</p>
          </div>
        );
      case 'create':
        return (
          <CreatePage 
            onOpenVpn={() => setIsVpnOpen(true)} 
            isVpnConnected={isVpnConnected} 
            onOpenCapCut={handleOpenCapCut}
          />
        );
      case 'messages':
        return <MessagesPage />;
      case 'profiles':
        if (!backendUser) {
          return (
            <AuthPage 
              onSuccess={(token, user) => {
                localStorage.setItem('backend_token', token);
                localStorage.setItem('backend_user', JSON.stringify(user));
                setBackendUser(user);
              }}
            />
          );
        }
        return (
          <div className="flex-1 w-full h-full bg-black">
            <ProfilePage 
              onBackgroundClick={() => setIsWallpaperMenuOpen(true)} 
              backendUser={backendUser}
              onLogout={() => {
                localStorage.removeItem('backend_token');
                localStorage.removeItem('backend_user');
                setBackendUser(null);
              }}
              onSuccessAuth={(token, user) => {
                localStorage.setItem('backend_token', token);
                localStorage.setItem('backend_user', JSON.stringify(user));
                setBackendUser(user);
              }}
            />
          </div>
        );
      case 'virtual':
        return <VirtualCommunication onClose={() => setActiveTab('home')} globalSelectedVoice={selectedVoice} />;
      case 'database':
        return <DatabaseConsole />;
      case 'python':
        return <PythonExecution />;
      case 'home':
      default:
        return (
          <div className="flex flex-col h-full justify-between w-full max-w-4xl mx-auto py-2">
            {/* Top Bar with Set Wallpaper Option */}
            <div className="flex items-center justify-between w-full pt-1 pb-2 px-2 z-20">
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs font-semibold drop-shadow-md flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active: <span className="text-emerald-300 font-bold">{activeWallpaper?.label || 'Live Wallpaper'}</span>
                </span>
              </div>
              
              <button
                onClick={() => setIsWallpaperMenuOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-emerald-400 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer group"
                title="Change or set background live wallpaper"
              >
                <ImageIcon size={14} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Set Wallpaper</span>
              </button>
            </div>
            
            {/* Main PandaBot Input Area */}
            <div className="mt-auto flex flex-col gap-6 w-full pt-4">
              <InputBox 
                isVoiceEnabled={isVoiceEnabled} 
                onVirtualCommunicationClick={() => setActiveTab('virtual')} 
                onRunPythonClick={() => setActiveTab('python')}
                onMessageSent={() => setHasSentPrompt(true)}
                globalSelectedVoice={selectedVoice}
                onWallpaperClick={() => setIsWallpaperMenuOpen(true)}
              />
            </div>
          </div>
        );
    }
  };
  return (
    <div className="flex h-screen w-full overflow-hidden text-ink font-sans relative bg-bg">
      {activeWallpaper && activeWallpaper.type === 'video' ? (
        <video
          key={activeWallpaper.id}
          src={activeWallpaper.url}
          onError={(e) => {
            const fallback = (activeWallpaper as any).fallbackUrl;
            if (fallback && e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
              e.currentTarget.play().catch(() => {});
            }
          }}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${scrollOffset * -0.15}px) scale(1.08)`,
            willChange: 'transform'
          }}
        />
      ) : (
        <img
          key={activeWallpaper?.id}
          src={activeWallpaper?.url}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${scrollOffset * -0.15}px) scale(1.08)`,
            willChange: 'transform'
          }}
          alt="Wallpaper"
        />
      )}
      <div className="absolute inset-0 bg-transparent z-0"></div>
      <div className="relative z-10 flex h-full w-full">
        <AnimatePresence>
          {isWallpaperMenuOpen && (
            <WallpaperMenu 
              onClose={() => setIsWallpaperMenuOpen(false)}
              currentWallpaperId={currentWallpaperId}
              setCurrentWallpaperId={setCurrentWallpaperId}
              customWallpapers={customWallpapers}
              setCustomWallpapers={setCustomWallpapers}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isSettingsOpen && (
            <UserSettingsMenu 
              onClose={() => setIsSettingsOpen(false)} 
              isVoiceEnabled={isVoiceEnabled}
              setIsVoiceEnabled={setIsVoiceEnabled}
              theme={theme}
              setTheme={setTheme}
              isFocusMode={isFocusMode}
              setIsFocusMode={setIsFocusMode}
              onOpenVpn={() => setIsVpnOpen(true)}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />
          )}
        </AnimatePresence>

        {/* Free VPN Proxy Modal */}
        <VpnModal 
          isOpen={isVpnOpen}
          onClose={() => setIsVpnOpen(false)}
          isConnected={isVpnConnected}
          setIsConnected={setIsVpnConnected}
          selectedNode={selectedVpnNode}
          setSelectedNode={setSelectedVpnNode}
        />

        {/* CapCut Online Studio Editor Modal */}
        <CapCutEditorModal 
          isOpen={isCapCutOpen}
          onClose={() => setIsCapCutOpen(false)}
          videoUrl={capCutVideoUrl}
          videoTitle={capCutVideoTitle}
          onOpenVpn={() => {
            setIsCapCutOpen(false);
            setIsVpnOpen(true);
          }}
        />

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent relative">
          
          <main 
            id="main-app-content"
            onScroll={(e) => setScrollOffset(e.currentTarget.scrollTop)}
            className={`flex-1 w-full mx-auto ${
              activeTab === 'reel' || activeTab === 'create' || activeTab === 'profiles' || activeTab === 'messages' || activeTab === 'virtual'
                ? 'p-0 max-w-full h-full overflow-hidden flex flex-col' 
                : 'max-w-5xl px-4 sm:px-8 md:px-10 pt-6 sm:pt-10 md:pt-12 pb-6 overflow-y-auto flex flex-col gap-6'
            } bg-transparent z-10`}
          >
            {renderContent()}
          </main>

          {/* Bottom Dock Footer Navigation Bar - Home Only */}
          {!isFocusMode && activeTab !== 'virtual' && (
            <div 
              style={{ backgroundColor: 'transparent', border: 'none' }}
              className="w-full shrink-0 bg-transparent border-none relative z-50 pb-2"
            >
              <footer 
                style={{
                  backgroundColor: '#000000',
                  borderWidth: '3px',
                  height: '39.930499999999995px',
                  width: '200.98899999999998px',
                  borderRadius: '20px',
                  borderStyle: 'ridge'
                }}
                className="flex justify-center items-center gap-2 mx-auto px-2 py-0 overflow-hidden shadow-2xl"
              >
                {/* Home Button */}
                <button 
                  onClick={() => setActiveTab('home')}
                  title="Home"
                  className={`flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full cursor-pointer transition-colors ${activeTab === 'home' ? 'text-white bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  <Home size={14} strokeWidth={2.5} fill={activeTab === 'home' ? "currentColor" : "none"} />
                  <span className="text-[11px] font-semibold">Home</span>
                </button>

                {/* Wallpaper Option Button */}
                <button 
                  onClick={() => setIsWallpaperMenuOpen(true)}
                  title="Set Wallpaper"
                  className="flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-white/10 cursor-pointer transition-all active:scale-95"
                >
                  <ImageIcon size={14} strokeWidth={2.2} />
                  <span className="text-[11px] font-semibold text-white/90">Wallpaper</span>
                </button>
              </footer>
            </div>
          )}
        </div>
      </div>

      {isFocusMode && (
        <button 
          onClick={() => setIsFocusMode(false)}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/40 dark:bg-black/30 backdrop-blur-[24px] border border-white/50 dark:border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] text-ink hover:text-accent dark:hover:text-accent transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-bold text-xs"
          title="Exit Focus Mode"
        >
          <EyeOff size={14} className="text-accent animate-pulse" />
          <span>Exit Focus Mode</span>
        </button>
      )}

      {siteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setSiteModal(null)}>
          <div 
            className="bg-bg border border-white/50 rounded-3xl overflow-hidden shadow-neu-lg relative w-[420px] h-[620px] max-w-[90vw] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-ink-faint bg-white/40 shrink-0">
              <h3 className="text-ink font-semibold text-sm">{siteModal.title}</h3>
              <button 
                onClick={() => setSiteModal(null)}
                className="w-7 h-7 rounded-full bg-white shadow-neu-sm hover:shadow-neu-sm-inset flex items-center justify-center text-neutral-500 hover:text-ink transition-all cursor-pointer border border-white/50"
              >
                ×
              </button>
            </div>
            <div className="flex-1 bg-white/5 relative">
              <iframe 
                src={siteModal.url} 
                className="absolute inset-0 w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

