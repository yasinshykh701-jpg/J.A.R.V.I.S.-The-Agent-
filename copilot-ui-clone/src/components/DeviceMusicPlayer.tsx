import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  FolderPlus, 
  Music, 
  ListMusic, 
  X, 
  Minimize2, 
  Maximize2, 
  HardDrive, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  Trash2,
  Disc3
} from 'lucide-react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  url: string;
  isDeviceFile?: boolean;
  cover?: string;
}

const DEFAULT_PRESET_SONGS: Song[] = [
  {
    id: 'preset_1',
    title: 'Cyberpunk Neon Nights',
    artist: 'ZarZayn Audio Core',
    album: 'Future Horizon',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    duration: 145
  },
  {
    id: 'preset_2',
    title: 'Midnight Synth Chill',
    artist: 'Aetheria Wave',
    album: 'Deep Focus',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    duration: 128
  },
  {
    id: 'preset_3',
    title: 'Cosmic Ambient Flow',
    artist: 'Panda Soundscape',
    album: 'Zenith',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxed-vlog-night-street-131746.mp3',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    duration: 160
  }
];

interface DeviceMusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isPlayingGlobal?: boolean;
  setIsPlayingGlobal?: (playing: boolean) => void;
  activeSongGlobal?: Song | null;
  setActiveSongGlobal?: (song: Song | null) => void;
}

export function DeviceMusicPlayer({ 
  isOpen, 
  onClose,
  isPlayingGlobal,
  setIsPlayingGlobal,
  activeSongGlobal,
  setActiveSongGlobal
}: DeviceMusicPlayerProps) {
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    const saved = localStorage.getItem('device_music_playlist_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Combine presets + metadata
        return parsed.length > 0 ? parsed : DEFAULT_PRESET_SONGS;
      } catch (e) {
        return DEFAULT_PRESET_SONGS;
      }
    }
    return DEFAULT_PRESET_SONGS;
  });

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(() => {
    return localStorage.getItem('device_audio_permission_granted') === 'true';
  });
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const folderPickerRef = useRef<HTMLInputElement>(null);

  const currentSong = playlist[currentSongIndex] || DEFAULT_PRESET_SONGS[0];

  useEffect(() => {
    if (setIsPlayingGlobal) setIsPlayingGlobal(isPlaying);
  }, [isPlaying, setIsPlayingGlobal]);

  useEffect(() => {
    if (setActiveSongGlobal) setActiveSongGlobal(currentSong);
  }, [currentSong, setActiveSongGlobal]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Autoplay audio blocked or error:", err);
      });
    }
  };

  const playSongAtIndex = (index: number) => {
    if (index < 0 || index >= playlist.length) return;
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log(err));
      }
    }, 50);
  };

  const handleNext = () => {
    if (isShuffled && playlist.length > 1) {
      let nextIdx = Math.floor(Math.random() * playlist.length);
      while (nextIdx === currentSongIndex) {
        nextIdx = Math.floor(Math.random() * playlist.length);
      }
      playSongAtIndex(nextIdx);
    } else {
      const nextIdx = (currentSongIndex + 1) % playlist.length;
      playSongAtIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentTime > 4) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      const prevIdx = (currentSongIndex - 1 + playlist.length) % playlist.length;
      playSongAtIndex(prevIdx);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Grant Device Data / Audio Permission
  const grantDevicePermission = () => {
    setHasPermission(true);
    localStorage.setItem('device_audio_permission_granted', 'true');
    setShowPermissionPrompt(false);
    // Trigger file picker directly
    filePickerRef.current?.click();
  };

  // Handle local files loaded from user's device
  const handleDeviceFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setHasPermission(true);
    localStorage.setItem('device_audio_permission_granted', 'true');

    const newSongs: Song[] = [];

    Array.from(files).forEach((file, idx) => {
      // Clean up title from filename
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      let title = rawName;
      let artist = "Device Audio";

      if (rawName.includes(" - ")) {
        const parts = rawName.split(" - ");
        artist = parts[0].trim();
        title = parts.slice(1).join(" - ").trim();
      }

      const blobUrl = URL.createObjectURL(file);
      newSongs.push({
        id: `device_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        title: title || file.name,
        artist: artist,
        album: 'Local Device Storage',
        url: blobUrl,
        isDeviceFile: true,
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'
      });
    });

    if (newSongs.length > 0) {
      setPlaylist(prev => {
        const updated = [...prev, ...newSongs];
        return updated;
      });
      // Start playing the first new added song
      playSongAtIndex(playlist.length);
    }

    if (e.target) e.target.value = '';
  };

  const removeSong = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (playlist.length <= 1) return;
    const targetIdx = playlist.findIndex(s => s.id === id);
    const updated = playlist.filter(s => s.id !== id);
    setPlaylist(updated);
    if (targetIdx === currentSongIndex) {
      playSongAtIndex(Math.min(targetIdx, updated.length - 1));
    } else if (targetIdx < currentSongIndex) {
      setCurrentSongIndex(prev => prev - 1);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <>
      {/* Hidden Audio Player Element */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        loop={isLooping}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          if (!isLooping) {
            handleNext();
          }
        }}
      />

      {/* Hidden Native File Input for Selecting Device Audio */}
      <input
        ref={filePickerRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleDeviceFiles}
        className="hidden"
      />

      {/* Hidden Directory Audio Input */}
      <input
        ref={folderPickerRef}
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleDeviceFiles}
        className="hidden"
      />

      {/* Floating Minimized Widget when minimized and active */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950/90 backdrop-blur-2xl border border-slate-300/40 rounded-2xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.7)] flex items-center gap-3 w-80 max-w-[90vw]"
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
              <img 
                src={currentSong?.cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80"} 
                alt="Cover" 
                className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`} 
              />
              <div className="absolute inset-0 bg-black/20" />
              <Disc3 size={18} className={`absolute inset-0 m-auto text-white/90 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-white text-xs font-semibold truncate">{currentSong?.title}</h4>
              <p className="text-white/60 text-[11px] truncate">{currentSong?.artist}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-white/50">{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-rose-400" 
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/50">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              <button 
                onClick={() => setIsMinimized(false)}
                className="w-7 h-7 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center"
                title="Expand player"
              >
                <Maximize2 size={13} />
              </button>
              <button 
                onClick={onClose}
                className="w-7 h-7 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center"
                title="Close"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glassy Device Music Player Modal */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-950/85 backdrop-blur-3xl border border-slate-300/40 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.75)] ring-1 ring-white/20 flex flex-col max-h-[90vh]"
            >
              {/* Top Specular Silver Highlight */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <Music size={16} />
                  </div>
                  <div>
                    <h2 className="text-white text-sm font-bold flex items-center gap-2">
                      Device Music Hub
                      {hasPermission && (
                        <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                          <ShieldCheck size={11} /> Device Storage Granted
                        </span>
                      )}
                    </h2>
                    <p className="text-white/50 text-[11px]">Play local device audio songs & stream ambient beats</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Minimize to floating widget"
                  >
                    <Minimize2 size={15} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Permission Banner (If not yet granted or prompt requested) */}
              {(!hasPermission || showPermissionPrompt) && (
                <div className="mx-6 mt-4 p-3.5 bg-gradient-to-r from-red-950/40 via-slate-900/80 to-slate-950/80 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-300 shrink-0">
                      <HardDrive size={18} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold">Device Media & Storage Permission</h4>
                      <p className="text-white/60 text-[11px]">Allow browser access to load audio files directly from your PC or mobile device.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={grantDevicePermission}
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <FolderPlus size={13} /> Select Device Audio
                    </button>
                    {showPermissionPrompt && (
                      <button 
                        onClick={() => setShowPermissionPrompt(false)}
                        className="px-2 py-1.5 text-white/50 hover:text-white text-xs"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Main Content: Player + Playlist */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] flex flex-col gap-6">
                
                {/* Now Playing Hero Deck */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center bg-white/5 border border-slate-300/20 rounded-2xl p-5 backdrop-blur-md shadow-inner">
                  {/* Album Art with Vinyl spinning aura */}
                  <div className="relative aspect-square max-w-[160px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
                    <img 
                      src={currentSong?.cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80"} 
                      alt="Cover" 
                      className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : ''}`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Visualizer Wave Bars overlay */}
                    {isPlaying && (
                      <div className="absolute bottom-2 inset-x-3 flex items-end justify-center gap-1 h-6">
                        {[40, 90, 60, 100, 75, 45, 80, 95, 50, 70, 85].map((h, i) => (
                          <span 
                            key={i} 
                            className="w-1 bg-red-400 rounded-full animate-pulse" 
                            style={{ 
                              height: `${h}%`,
                              animationDuration: `${0.4 + (i % 3) * 0.2}s`
                            }} 
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Song Metadata & Controls */}
                  <div className="md:col-span-2 flex flex-col justify-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {currentSong?.isDeviceFile ? (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            Local File
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                            Streaming Audio
                          </span>
                        )}
                        <span className="text-white/40 text-xs truncate">{currentSong?.album || 'ZarZayn Beats'}</span>
                      </div>
                      <h3 className="text-white text-lg font-bold truncate">{currentSong?.title}</h3>
                      <p className="text-white/70 text-sm truncate">{currentSong?.artist}</p>
                    </div>

                    {/* Timeline Slider */}
                    <div className="flex flex-col gap-1">
                      <input 
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-all"
                      />
                      <div className="flex justify-between text-[11px] text-white/50 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Playback Button Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsShuffled(!isShuffled)}
                          className={`p-2 rounded-full transition-colors cursor-pointer ${isShuffled ? 'text-red-400 bg-red-500/20' : 'text-white/50 hover:text-white'}`}
                          title="Shuffle"
                        >
                          <Shuffle size={16} />
                        </button>
                        <button 
                          onClick={() => setIsLooping(!isLooping)}
                          className={`p-2 rounded-full transition-colors cursor-pointer ${isLooping ? 'text-red-400 bg-red-500/20' : 'text-white/50 hover:text-white'}`}
                          title="Repeat"
                        >
                          <Repeat size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handlePrev}
                          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Previous track"
                        >
                          <SkipBack size={16} />
                        </button>
                        <button 
                          onClick={togglePlay}
                          className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                        </button>
                        <button 
                          onClick={handleNext}
                          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Next track"
                        >
                          <SkipForward size={16} />
                        </button>
                      </div>

                      {/* Volume Slider */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={toggleMute}
                          className="text-white/70 hover:text-white p-1"
                        >
                          {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
                        </button>
                        <input 
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playlist & Add Device Media Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <ListMusic size={15} className="text-red-400" />
                      Playlist ({playlist.length} Tracks)
                    </h4>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => filePickerRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-slate-300/30 text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title="Upload audio files from device"
                      >
                        <FolderPlus size={14} className="text-red-400" /> Add Device Songs
                      </button>
                      
                      <button
                        onClick={() => folderPickerRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-slate-300/30 text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hidden sm:flex"
                        title="Import whole folder of songs"
                      >
                        <HardDrive size={14} className="text-cyan-400" /> Import Folder
                      </button>
                    </div>
                  </div>

                  {/* Track List */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar pr-1">
                    {playlist.map((song, idx) => {
                      const isCurrent = idx === currentSongIndex;
                      return (
                        <div
                          key={song.id}
                          onClick={() => playSongAtIndex(idx)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                            isCurrent
                              ? 'bg-red-500/20 border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                              : 'bg-slate-900/40 hover:bg-slate-800/60 border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-5 text-center text-xs font-mono text-white/50">
                              {isCurrent && isPlaying ? (
                                <span className="flex gap-0.5 justify-center items-end h-3">
                                  <span className="w-0.5 bg-red-400 h-full animate-pulse" />
                                  <span className="w-0.5 bg-red-400 h-2 animate-pulse delay-75" />
                                  <span className="w-0.5 bg-red-400 h-3 animate-pulse delay-150" />
                                </span>
                              ) : (
                                idx + 1
                              )}
                            </span>

                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img src={song.cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80"} alt="Art" className="w-full h-full object-cover" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-red-300 font-bold' : 'text-white'}`}>
                                  {song.title}
                                </p>
                                {song.isDeviceFile && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    Device
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-white/50 truncate">{song.artist}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {song.duration && (
                              <span className="text-[11px] text-white/40 font-mono">
                                {formatTime(song.duration)}
                              </span>
                            )}
                            
                            {playlist.length > 1 && (
                              <button
                                onClick={(e) => removeSong(e, song.id)}
                                className="p-1 text-white/30 hover:text-red-400 transition-colors"
                                title="Remove track from playlist"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
