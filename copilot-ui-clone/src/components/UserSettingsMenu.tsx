import { useState, useRef, useEffect } from 'react';
import { Settings, User, Volume2, VolumeX, Sun, Moon, EyeOff, ShieldCheck, Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { VoiceSettings, GEMINI_VOICES } from './VoiceSettings';

interface UserSettingsMenuProps {
  onClose: () => void;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isFocusMode: boolean;
  setIsFocusMode: (enabled: boolean) => void;
  onOpenVpn?: () => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export function UserSettingsMenu({ 
  onClose, 
  isVoiceEnabled, 
  setIsVoiceEnabled,
  theme,
  setTheme,
  isFocusMode,
  setIsFocusMode,
  onOpenVpn,
  selectedVoice,
  setSelectedVoice
}: UserSettingsMenuProps) {
  const [activeMenu, setActiveMenu] = useState<'main' | 'voice'>('main');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const selectedVoiceName = GEMINI_VOICES.find(v => v.id === selectedVoice)?.name || 'Puck';

  return (
    <motion.div 
      ref={menuRef}
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 35, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 320 }}
      className="absolute bottom-6 left-20 w-[240px] bg-white border border-ink-faint rounded-[24px] shadow-neu-lg overflow-hidden z-50 text-ink p-1.5 origin-bottom"
    >
      {activeMenu === 'main' && (
        <div className="py-1">
          <div className="px-4 py-3 border-b border-ink-faint flex items-center gap-3 bg-white/40 rounded-t-2xl mb-1">
            <div className="w-[32px] h-[32px] bg-accent rounded-full text-white text-[12px] font-extrabold flex items-center justify-center shadow-neu-sm border border-white/20">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-ink">User Profile</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Free Plan</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-0.5">
            <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-bg rounded-xl text-xs font-bold text-neutral-600 hover:text-ink text-left transition-all cursor-pointer">
              <User size={14} className="text-neutral-400" />
              <span>Account Settings</span>
            </button>
            {onOpenVpn && (
              <button 
                onClick={() => {
                  onOpenVpn();
                  onClose();
                }}
                className="flex items-center justify-between w-full px-3 py-2 hover:bg-emerald-500/10 rounded-xl text-xs font-bold text-emerald-600 hover:text-emerald-700 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Free VPN Access</span>
                </div>
                <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </button>
            )}
            <button 
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-bg rounded-xl text-xs font-bold text-neutral-600 hover:text-ink text-left transition-all cursor-pointer"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            >
              <div className="flex items-center gap-3">
                {isVoiceEnabled ? <Volume2 size={14} className="text-accent" /> : <VolumeX size={14} className="text-neutral-400" />}
                <span>Voice Feedback</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${isVoiceEnabled ? 'bg-accent' : 'bg-neutral-200'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${isVoiceEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
            <button 
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-bg rounded-xl text-xs font-bold text-neutral-600 hover:text-ink text-left transition-all cursor-pointer"
              onClick={() => setActiveMenu('voice')}
            >
              <div className="flex items-center gap-3">
                <Mic size={14} className="text-accent" />
                <span>Select Voice</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                {selectedVoiceName}
              </span>
            </button>
            <button 
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-bg rounded-xl text-xs font-bold text-neutral-600 hover:text-ink text-left transition-all cursor-pointer"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={14} className="text-accent" /> : <Sun size={14} className="text-amber-500" />}
                <span>Dark Mode</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${theme === 'dark' ? 'bg-accent' : 'bg-neutral-200'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
            <button 
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-bg rounded-xl text-xs font-bold text-neutral-600 hover:text-ink text-left transition-all cursor-pointer"
              onClick={() => setIsFocusMode(!isFocusMode)}
            >
              <div className="flex items-center gap-3">
                <EyeOff size={14} className={isFocusMode ? "text-accent" : "text-neutral-400"} />
                <span>Focus Mode</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${isFocusMode ? 'bg-accent' : 'bg-neutral-200'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${isFocusMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-bg rounded-xl text-xs font-bold text-neutral-600 hover:text-ink text-left transition-all cursor-pointer">
              <Settings size={14} className="text-neutral-400" />
              <span>App Preferences</span>
            </button>
          </div>
        </div>
      )}
      
      {activeMenu === 'voice' && (
        <VoiceSettings 
          selectedVoice={selectedVoice} 
          onSelectVoice={(id) => { setSelectedVoice(id); }}
          onBack={() => setActiveMenu('main')}
        />
      )}
    </motion.div>
  );
}
