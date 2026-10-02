import { MessageSquare, History, Play, PlusSquare, UserCircle, Home, Search, ChevronRight, Settings, Image as ImageIcon, Database } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type TabType = 'home' | 'search' | 'reel' | 'history' | 'create' | 'profiles' | 'virtual' | 'python' | 'messages' | 'database';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onProfileClick: () => void;
  onWallpaperClick?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onProfileClick, onWallpaperClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getTabClass = (tab: TabType, gradient: string) => {
    const isActive = activeTab === tab;
    return `flex flex-col items-center justify-center p-3 aspect-square rounded-[22px] transition-all cursor-pointer shadow-sm text-white ${gradient} ${
      isActive 
        ? 'ring-4 ring-white/30 scale-[0.95]' 
        : 'hover:scale-105'
    }`;
  };

  return (
    <>
      <div className={`fixed z-[70] transition-colors duration-500 flex ${isOpen ? 'inset-0 items-center justify-center bg-black/60 backdrop-blur-sm' : 'top-[112px] sm:top-[128px] md:top-[138px] left-1/2 -translate-x-1/2'}`}>
        {isOpen && (
          <div className="absolute inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
        )}
        <motion.button
          layout
          initial={false}
          onClick={() => !isOpen && setIsOpen(true)}
          transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
          className={`overflow-hidden flex flex-col items-center justify-start cursor-pointer origin-center ${
            isOpen 
              ? 'bg-black/40 backdrop-blur-3xl border border-white/10 w-[90%] max-w-[400px] h-[80%] max-h-[700px] rounded-[40px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
              : 'bg-black w-[120px] h-[34px] rounded-full border border-black shadow-md hover:scale-105'
          }`}
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div 
                key="closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full flex items-center justify-center gap-2"
              >
                 <div className="w-2 h-2 rounded-full bg-white/20"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
              </motion.div>
            ) : (
              <motion.div 
                key="open"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ delay: 0.1, duration: 0.25, type: 'spring', bounce: 0 }}
                className="w-full h-full flex flex-col"
              >
                 <div className="flex justify-end items-center mb-6 px-2">
                   <div onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors cursor-pointer">
                     <ChevronRight size={16} className="rotate-90" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4 no-scrollbar px-1">
                   <div className={getTabClass('home', 'bg-gradient-to-b from-blue-400 to-blue-600')} onClick={(e) => { e.stopPropagation(); setActiveTab('home'); setIsOpen(false); }}>
                     <Home size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Home</span>
                   </div>
                   <div className={getTabClass('search', 'bg-gradient-to-b from-slate-400 to-slate-600')} onClick={(e) => { e.stopPropagation(); setActiveTab('search'); setIsOpen(false); }}>
                     <Search size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Search</span>
                   </div>
                   <div className={getTabClass('reel', 'bg-gradient-to-b from-rose-400 to-red-500')} onClick={(e) => { e.stopPropagation(); setActiveTab('reel'); setIsOpen(false); }}>
                     <Play size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Play</span>
                   </div>
                   <div className={getTabClass('history', 'bg-gradient-to-b from-stone-700 to-stone-900')} onClick={(e) => { e.stopPropagation(); setActiveTab('history'); setIsOpen(false); }}>
                     <History size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">History</span>
                   </div>
                   <div className={getTabClass('create', 'bg-gradient-to-b from-amber-400 to-orange-500')} onClick={(e) => { e.stopPropagation(); setActiveTab('create'); setIsOpen(false); }}>
                     <PlusSquare size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Create</span>
                   </div>
                   <div className={getTabClass('messages', 'bg-gradient-to-b from-green-400 to-green-500')} onClick={(e) => { e.stopPropagation(); setActiveTab('messages'); setIsOpen(false); }}>
                     <MessageSquare size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Messages</span>
                   </div>
                   <div className={getTabClass('profiles', 'bg-gradient-to-b from-cyan-400 to-blue-500')} onClick={(e) => { e.stopPropagation(); setActiveTab('profiles'); setIsOpen(false); }}>
                     <UserCircle size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Profiles</span>
                   </div>
                   <div className={getTabClass('database', 'bg-gradient-to-b from-amber-500 to-yellow-600')} onClick={(e) => { e.stopPropagation(); setActiveTab('database'); setIsOpen(false); }}>
                     <Database size={28} strokeWidth={1.5} className="mb-1 drop-shadow-md" />
                     <span className="text-[9px] font-medium tracking-wide">Database</span>
                   </div>
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-white/10 flex gap-3">
                   <div 
                     className="flex-1 bg-gradient-to-b from-gray-200 to-gray-400 hover:from-gray-100 hover:to-gray-300 text-gray-900 rounded-2xl p-3 flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                     onClick={(e) => { e.stopPropagation(); onProfileClick(); setIsOpen(false); }}
                   >
                     <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center shrink-0">
                       <Settings size={18} className="text-gray-800" strokeWidth={2} />
                     </div>
                     <span className="text-sm font-semibold tracking-wide">Settings</span>
                   </div>
                   
                   {onWallpaperClick && (
                     <div 
                       className="flex-1 bg-gradient-to-b from-fuchsia-400 to-purple-500 hover:from-fuchsia-300 hover:to-purple-400 text-white rounded-2xl p-3 flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                       onClick={(e) => { e.stopPropagation(); onWallpaperClick(); setIsOpen(false); }}
                     >
                       <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center shrink-0">
                         <ImageIcon size={18} className="text-white" strokeWidth={2} />
                       </div>
                       <span className="text-sm font-semibold tracking-wide">Wallpaper</span>
                     </div>
                   )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      
    </>
  );
}

