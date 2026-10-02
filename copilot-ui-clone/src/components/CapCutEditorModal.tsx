import React, { useState } from 'react';
import { 
  X, 
  Scissors, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Wand2, 
  Music, 
  Type, 
  Sliders, 
  Layers, 
  Download, 
  ExternalLink, 
  Globe, 
  Check, 
  Zap, 
  Film, 
  Plus, 
  Video,
  Volume2
} from 'lucide-react';

interface CapCutEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  videoTitle?: string;
  onOpenVpn?: () => void;
}

const TEMPLATES = [
  { id: 't1', name: 'Cyberpunk Neon Beat', duration: '0:15', usage: '2.4M', icon: '⚡' },
  { id: 't2', name: 'Cinematic Slow Motion', duration: '0:20', usage: '5.1M', icon: '🎬' },
  { id: 't3', name: 'Velocity Zoom Sync', duration: '0:12', usage: '8.9M', icon: '🔥' },
  { id: 't4', name: '3D Photo Flash Trend', duration: '0:10', usage: '1.8M', icon: '✨' },
];

export const CapCutEditorModal: React.FC<CapCutEditorModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  videoTitle = 'Sample Video Clip',
  onOpenVpn
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'templates'>('editor');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [speed, setSpeed] = useState(1);
  const [filter, setFilter] = useState('normal');
  const [hasExported, setHasExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setHasExported(true);
    setTimeout(() => {
      setHasExported(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl h-[90vh] bg-neutral-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-neutral-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400 text-black rounded-xl flex items-center justify-center font-black shadow-lg">
              <Scissors size={20} className="rotate-45" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                CapCut Online Studio
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Built-in Web Editor
                </span>
              </h3>
              <p className="text-white/50 text-[11px] truncate max-w-xs sm:max-w-md">
                Editing: {videoTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Official CapCut Web Link */}
            <a 
              href="https://www.capcut.com/editor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
            >
              <span>CapCut Official Web</span>
              <ExternalLink size={12} className="text-amber-400" />
            </a>

            {/* VPN Shortcut */}
            {onOpenVpn && (
              <button 
                onClick={onOpenVpn}
                className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                title="If CapCut is blocked in your region, use Free VPN"
              >
                <Globe size={12} />
                <span className="hidden md:inline">Bypass Regional Block (VPN)</span>
                <span className="md:hidden">VPN</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Sub-Header Navigation */}
        <div className="bg-neutral-900/60 px-5 py-2 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'editor' ? 'bg-amber-400 text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              Timeline Studio
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'templates' ? 'bg-amber-400 text-black shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              CapCut Templates
            </button>
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <span>Aspect Ratio:</span>
            <span className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-white font-mono font-bold">9:16 (TikTok)</span>
          </div>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 bg-black">
          
          {/* Left / Top Canvas Viewport */}
          <div className="md:col-span-2 relative bg-neutral-950 flex flex-col items-center justify-center p-4 border-r border-white/10 overflow-hidden">
            
            {/* Video Player Box */}
            <div className="relative h-full max-h-[460px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center">
              <video 
                src={videoUrl}
                className={`w-full h-full object-cover ${
                  filter === 'vintage' ? 'sepia contrast-125' :
                  filter === 'cyber' ? 'hue-rotate-90 saturate-200' :
                  filter === 'bw' ? 'grayscale' : ''
                }`}
                autoPlay={isPlaying}
                loop
                muted
                playsInline
              />

              {/* Watermark Overlay */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1 text-[10px] font-black text-amber-400">
                <Scissors size={12} className="rotate-45" /> CapCut
              </div>

              {/* Play / Pause Toggle overlay */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all group"
              >
                <div className="w-14 h-14 bg-amber-400/90 text-black rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
                </div>
              </button>
            </div>

            {/* Canvas Quick Toolbar */}
            <div className="mt-3 flex items-center gap-4 bg-neutral-900/80 px-4 py-2 rounded-full border border-white/10 text-xs font-semibold">
              <button 
                onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Zap size={14} className="text-amber-400" />
                <span>Speed: {speed}x</span>
              </button>
              
              <div className="w-px h-4 bg-white/20" />

              <button 
                onClick={() => setFilter(f => f === 'normal' ? 'cyber' : f === 'cyber' ? 'vintage' : f === 'vintage' ? 'bw' : 'normal')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Wand2 size={14} className="text-amber-400" />
                <span>Filter: {filter.toUpperCase()}</span>
              </button>
            </div>

          </div>

          {/* Right Sidebar Controls & Tools */}
          <div className="p-4 bg-neutral-900 overflow-y-auto flex flex-col gap-5 text-left border-t md:border-t-0 border-white/10">
            
            {activeTab === 'editor' ? (
              <>
                {/* CapCut Tools Palette */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Editing Tools</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl border border-white/10 text-xs font-bold text-white transition-all">
                      <Scissors size={16} className="text-amber-400 rotate-45" />
                      <span>Split Clip</span>
                    </button>

                    <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl border border-white/10 text-xs font-bold text-white transition-all">
                      <Music size={16} className="text-blue-400" />
                      <span>Add Audio</span>
                    </button>

                    <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl border border-white/10 text-xs font-bold text-white transition-all">
                      <Type size={16} className="text-emerald-400" />
                      <span>Text & Titles</span>
                    </button>

                    <button className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl border border-white/10 text-xs font-bold text-white transition-all">
                      <Sparkles size={16} className="text-purple-400" />
                      <span>AI Effects</span>
                    </button>
                  </div>
                </div>

                {/* Speed Controls */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Playback Speed</h4>
                  <div className="flex gap-2">
                    {[1, 1.25, 1.5, 2].map(s => (
                      <button 
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          speed === s ? 'bg-amber-400 text-black border-amber-400' : 'bg-neutral-800 text-white/70 border-white/10'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regional Block Helper Note */}
                <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl flex flex-col gap-1.5 text-xs">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Globe size={14} /> CapCut Regional Notice
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    If CapCut Official shows "Not Found" or is restricted in your area, use our integrated <strong>Free VPN Proxy</strong> to unlock full CapCut web access instantly.
                  </p>
                  {onOpenVpn && (
                    <button 
                      onClick={onOpenVpn}
                      className="mt-1 bg-amber-400 text-black font-bold py-1 px-2.5 rounded-lg text-[11px] hover:bg-amber-300 transition-colors self-start"
                    >
                      Connect Free VPN
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* CapCut Templates Selection */
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Trending CapCut Templates</h4>
                
                <div className="flex flex-col gap-2.5">
                  {TEMPLATES.map(tmpl => (
                    <button 
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedTemplate.id === tmpl.id 
                          ? 'bg-amber-400/20 border-amber-400 text-white' 
                          : 'bg-neutral-800/80 border-white/10 text-white/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tmpl.icon}</span>
                        <div>
                          <div className="font-bold text-xs text-white">{tmpl.name}</div>
                          <div className="text-[10px] text-white/50">{tmpl.duration} • {tmpl.usage} uses</div>
                        </div>
                      </div>

                      {selectedTemplate.id === tmpl.id && (
                        <Check size={16} className="text-amber-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="px-6 py-4 bg-neutral-900 border-t border-white/10 flex items-center justify-between">
          <a 
            href="https://www.capcut.com/editor" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <ExternalLink size={14} className="text-amber-400" />
            <span>Open CapCut in New Tab</span>
          </a>

          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button 
              onClick={handleExport}
              disabled={hasExported}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-6 py-2 rounded-xl text-xs font-extrabold transition-all shadow-lg hover:scale-105"
            >
              {hasExported ? (
                <>
                  <Check size={16} />
                  <span>Exported!</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Export & Save Video</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
