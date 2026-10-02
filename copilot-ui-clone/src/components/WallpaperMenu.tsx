import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Check, Image as ImageIcon, MonitorPlay, Trash2, Palette, Copy, Sparkles, Video, Film, Flame } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { saveWallpaper, deleteWallpaper } from '../lib/wallpaperDb';
import { extractColors } from '../lib/colorExtractor';

export interface WallpaperItem {
  id: string;
  url: string;
  fallbackUrl?: string;
  type: 'image' | 'video';
  label: string;
  isCustom?: boolean;
}

interface WallpaperMenuProps {
  onClose: () => void;
  currentWallpaperId: string;
  setCurrentWallpaperId: (id: string) => void;
  customWallpapers: WallpaperItem[];
  setCustomWallpapers: React.Dispatch<React.SetStateAction<WallpaperItem[]>>;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const PRESET_WALLPAPERS: WallpaperItem[] = [
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

export function WallpaperMenu({ 
  onClose, 
  currentWallpaperId, 
  setCurrentWallpaperId,
  customWallpapers,
  setCustomWallpapers,
  accentColor,
  setAccentColor
}: WallpaperMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'image' | 'custom'>('all');
  const [palette, setPalette] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processFile = async (file: File) => {
    setIsUploading(true);
    const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|mkv|ogg)$/i);
    setUploadStatus(isVideo ? 'Loading Live Video...' : 'Loading Image...');

    try {
      const id = `custom_${Date.now()}`;
      
      // Save file directly to IndexedDB
      await saveWallpaper({
        id,
        blob: file,
        type: isVideo ? 'video' : 'image',
        label: file.name.replace(/\.[^/.]+$/, "")
      });

      // Create local object URL for instant UI response
      const url = URL.createObjectURL(file);
      
      const newWallpaper: WallpaperItem = {
        id,
        url,
        type: isVideo ? 'video' : 'image',
        label: file.name.replace(/\.[^/.]+$/, "") + (isVideo ? ' 🎥' : ''),
        isCustom: true
      };

      setCustomWallpapers(prev => [newWallpaper, ...prev]);
      setCurrentWallpaperId(id);
      setUploadStatus(isVideo ? 'Live Video Wallpaper Active! ✨' : 'Wallpaper Updated! ✨');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save uploaded wallpaper:', err);
      setUploadStatus('Failed to upload. Please try another file.');
      setTimeout(() => setUploadStatus(null), 3500);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteWallpaper(id);
      
      // Find the item to revoke object URL
      const itemToDelete = customWallpapers.find(w => w.id === id);
      if (itemToDelete && itemToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(itemToDelete.url);
      }

      setCustomWallpapers(prev => prev.filter(w => w.id !== id));
      
      // Fallback if deleted wallpaper was active
      if (currentWallpaperId === id) {
        setCurrentWallpaperId('nature_live');
      }
    } catch (err) {
      console.error('Failed to delete wallpaper:', err);
    }
  };

  const allWallpapers = [...customWallpapers, ...PRESET_WALLPAPERS];

  const filteredWallpapers = allWallpapers.filter(wp => {
    if (activeFilter === 'video') return wp.type === 'video';
    if (activeFilter === 'image') return wp.type === 'image';
    if (activeFilter === 'custom') return wp.isCustom;
    return true;
  });

  // Extract color palette whenever the current wallpaper changes
  useEffect(() => {
    const active = allWallpapers.find(w => w.id === currentWallpaperId) || PRESET_WALLPAPERS[0];
    if (!active) return;

    // Preset palettes are predefined for instant response
    const presets: Record<string, string[]> = {
      nature_live: ['#15803d', '#047857', '#166534', '#065f46', '#064e3b'],
      nature_waterfall: ['#0284c7', '#0369a1', '#0f766e', '#075985', '#0c4a6e'],
      sunflower1: ['#eab308', '#ca8a04', '#0284c7', '#a16207', '#713f12'],
      video1: ['#1e1b4b', '#4338ca', '#a21caf', '#312e81', '#111827'],
      video2: ['#d97706', '#9a3412', '#b45309', '#1e293b', '#0f172a'],
      img1: ['#475569', '#cbd5e1', '#64748b', '#0f172a', '#1e293b']
    };

    if (presets[active.id]) {
      setPalette(presets[active.id]);
      return;
    }

    const extract = async () => {
      setIsExtracting(true);
      try {
        const colors = await extractColors(active.url, active.type);
        setPalette(colors);
      } catch (err) {
        console.error('Failed to extract colors:', err);
        setPalette(['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']);
      } finally {
        setIsExtracting(false);
      }
    };
    
    extract();
  }, [currentWallpaperId, customWallpapers]);

  // Copy hex code to clipboard
  const handleCopyColor = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4"
      onClick={onClose}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`w-full max-w-3xl bg-neutral-950/90 backdrop-blur-2xl border ${isDraggingOver ? 'border-emerald-400 ring-4 ring-emerald-400/30' : 'border-white/20'} rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-hidden transition-all`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Title & Close */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Film className="text-emerald-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white m-0 leading-tight flex items-center gap-2">
                Live Wallpaper Gallery
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Video & Images
                </span>
              </h2>
              <p className="text-white/50 text-xs sm:text-sm m-0">Upload any video or photo from your device to set as live background</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Upload Buttons & Drag-Drop Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Upload Video Button */}
          <button
            onClick={() => !isUploading && videoInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-400/40 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video size={18} className="text-emerald-300" />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold text-emerald-200">Upload Live Video (.mp4 / .webm)</div>
              <div className="text-[10px] text-white/60">Set any video as looping background</div>
            </div>
          </button>

          {/* Upload Photo Button */}
          <button
            onClick={() => !isUploading && fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon size={18} className="text-white/80" />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold text-white">Upload Custom Image</div>
              <div className="text-[10px] text-white/60">JPG, PNG, WebP or high-res photo</div>
            </div>
          </button>

          {/* Hidden File Inputs */}
          <input 
            type="file" 
            ref={videoInputRef} 
            className="hidden" 
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>

        {/* Upload Status Alert */}
        <AnimatePresence>
          {uploadStatus && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-2"
            >
              <Sparkles size={14} className="animate-spin text-emerald-300" />
              <span>{uploadStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filters */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'all', label: 'All Wallpapers' },
            { id: 'video', label: 'Live Videos 🎥' },
            { id: 'image', label: 'Static Images 🖼️' },
            { id: 'custom', label: 'My Uploads ⭐' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id 
                  ? 'bg-emerald-500 text-black shadow-md' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wallpapers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[42vh] pr-1 pb-1">
          {filteredWallpapers.map((wp) => (
            <div 
              key={wp.id}
              onClick={() => setCurrentWallpaperId(wp.id)}
              className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer group transition-all ${
                currentWallpaperId === wp.id 
                  ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-black scale-[0.98] shadow-lg shadow-emerald-500/20' 
                  : 'hover:scale-[1.02] ring-1 ring-white/20 hover:ring-white/40'
              }`}
            >
              {wp.type === 'video' ? (
                <video 
                  src={wp.url} 
                  onError={(e) => {
                    if (wp.fallbackUrl && e.currentTarget.src !== wp.fallbackUrl) {
                      e.currentTarget.src = wp.fallbackUrl;
                      e.currentTarget.play().catch(() => {});
                    }
                  }}
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                />
              ) : (
                <img src={wp.url} alt={wp.label} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90" />
              
              {/* Type Badge */}
              <div className="absolute top-2.5 left-2.5">
                {wp.type === 'video' ? (
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-[10px] font-bold text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/40 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE VIDEO
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-[10px] font-medium text-white/80 px-2 py-0.5 rounded-full border border-white/20">
                    PHOTO
                  </span>
                )}
              </div>

              {/* Title & Type Icon */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="text-white text-xs font-medium truncate max-w-[75%] drop-shadow-md">{wp.label}</span>
                <div className="flex items-center gap-1.5">
                  {wp.type === 'video' ? <MonitorPlay size={14} className="text-emerald-300" /> : <ImageIcon size={14} className="text-white/70" />}
                </div>
              </div>

              {/* Delete Custom Button */}
              {wp.isCustom && (
                <button
                  onClick={(e) => handleDelete(e, wp.id)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
                  title="Delete uploaded wallpaper"
                >
                  <Trash2 size={12} />
                </button>
              )}

              {/* Active Selection Checkmark */}
              {currentWallpaperId === wp.id && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check size={14} className="text-black font-extrabold" strokeWidth={3} />
                </div>
              )}
            </div>
          ))}

          {/* Quick Drop Zone Card */}
          <div 
            onClick={() => !isUploading && videoInputRef.current?.click()}
            className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center gap-2 group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 group-hover:bg-emerald-500/25 flex items-center justify-center transition-colors">
              <Upload size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 text-center px-2">
              {isUploading ? 'Processing...' : '+ Drop Video or Photo here'}
            </span>
          </div>
        </div>

        {/* Extracted Color Palette Section */}
        <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Palette className="text-emerald-400" size={16} />
              <span className="font-semibold text-xs sm:text-sm">Adaptive Theme Accent Palette</span>
              {isExtracting && (
                <span className="text-xs text-white/40 animate-pulse">(Extracting colors...)</span>
              )}
            </div>
            <span className="text-[11px] text-white/40">Click swatch to apply UI accent</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {palette.map((color, index) => {
              const isAccent = accentColor.toLowerCase() === color.toLowerCase();
              return (
                <div 
                  key={`${color}-${index}`}
                  onClick={() => setAccentColor(color)}
                  className={`group relative flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full pl-2 pr-3 py-1 cursor-pointer transition-all border ${isAccent ? 'border-emerald-400 bg-emerald-400/15' : 'border-white/5 hover:border-white/20'}`}
                >
                  {/* Swatch circle */}
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 relative shadow-inner"
                    style={{ backgroundColor: color }}
                  >
                    {isAccent && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                        <Sparkles size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Color hex text */}
                  <span className="text-[11px] font-mono text-white/80 font-medium">{color.toUpperCase()}</span>

                  {/* Copy button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyColor(color, index);
                    }}
                    className="p-0.5 rounded-full hover:bg-white/15 text-white/40 hover:text-white transition-colors"
                    title="Copy hex code"
                  >
                    {copiedIndex === index ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Reset to default option */}
            {accentColor !== '#10B981' && (
              <button
                onClick={() => setAccentColor('#10B981')}
                className="text-xs text-emerald-400/70 hover:text-emerald-300 underline underline-offset-4 pl-2 cursor-pointer transition-colors"
              >
                Reset to Nature Green
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
