import React, { useState, useRef, useEffect } from 'react';
import { storage, auth, db } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ChevronLeft, Upload, Play, Pause, RotateCcw, RotateCw, Maximize2,
  Scissors, Music, Type, Sticker, Copy, Wand2, Filter, Settings,
  Image as ImageIcon, SlidersHorizontal, ChevronDown, Check, Loader2, Minimize2
} from 'lucide-react';

interface CreatePageProps {
  onOpenCapCut?: (videoUrl?: string, title?: string) => void;
  onOpenVpn?: () => void;
  isVpnConnected?: boolean;
}

export const CreatePage: React.FC<CreatePageProps> = ({ onOpenCapCut, onOpenVpn, isVpnConnected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
          if (videoRef.current.currentTime >= videoRef.current.duration || videoRef.current.ended) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportMessage('Exporting...');
    try {
      const res = await fetch('/api/export', { method: 'POST' });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setExportMessage(data.message);
          setTimeout(() => setExportMessage(''), 3000);
        }
      } else {
        throw new Error('Non-JSON response');
      }
    } catch (err) {
      setExportMessage('Export failed.');
      setTimeout(() => setExportMessage(''), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds % 1) * 10);
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!auth.currentUser) {
       showToast("You must be logged in to upload.");
       return;
    }

    setIsUploading(true);
    showToast("Uploading video...");

    const storageRef = ref(storage, `videos/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setToastMessage(`Uploading... ${Math.round(progress)}%`);
      }, 
      (error) => {
        console.error("Upload error:", error);
        showToast("Upload failed");
        setIsUploading(false);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setVideoUrl(downloadURL);
          
          // Save to Firestore
          try {
            await addDoc(collection(db, 'videos'), {
              videoUrl: downloadURL,
              author: {
                handle: 'creator_' + auth.currentUser?.uid.substring(0, 5),
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
                isVerified: false
              },
              description: 'My new video! #creative',
              songName: 'Original Sound',
              likesCount: 0,
              commentsCount: 0,
              savesCount: 0,
              sharesCount: 0,
              hashtags: ['creative'],
              comments: [],
              createdAt: serverTimestamp()
            });
            showToast("Upload complete & Posted to Feed!");
          } catch (err) {
            console.error("Error adding doc:", err);
            showToast("Upload complete but failed to post.");
          }
          
          setIsUploading(false);
          setDuration(0); // reset duration to trigger loadedmetadata again properly
        });
      }
    );
  };

  const tools = [
    { icon: <Scissors size={20} />, label: 'Edit', action: () => { setActiveTool('Edit'); showToast('Edit tool selected'); } },
    { icon: <Music size={20} />, label: 'Audio', action: () => { setActiveTool('Audio'); showToast('Audio tool selected'); } },
    { icon: <Type size={20} />, label: 'Text', action: () => { setActiveTool('Text'); showToast('Text tool selected'); } },
    { icon: <Sticker size={20} />, label: 'Stickers', action: () => { setActiveTool('Stickers'); showToast('Stickers opened'); } },
    { icon: <Copy size={20} />, label: 'Overlay', action: () => { setActiveTool('Overlay'); showToast('Overlay selected'); } },
    { icon: <Wand2 size={20} />, label: 'Effects', action: () => { setActiveTool('Effects'); showToast('Effects opened'); } },
    { icon: <Filter size={20} />, label: 'Filters', action: () => { setActiveTool('Filters'); showToast('Filters opened'); } },
    { icon: <Settings size={20} />, label: 'Format', action: () => { setActiveTool('Format'); showToast('Format settings'); } },
    { icon: <ImageIcon size={20} />, label: 'Canvas', action: () => { setActiveTool('Canvas'); showToast('Canvas settings'); } },
    { icon: <SlidersHorizontal size={20} />, label: 'Adjust', action: () => { setActiveTool('Adjust'); showToast('Adjustments opened'); } },
  ];

  return (
    <div ref={containerRef} className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} bg-[#111111] text-white flex flex-col overflow-hidden select-none font-sans`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-semibold z-50 backdrop-blur-md border border-white/10 shadow-xl transition-all">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-white/5 shrink-0 z-40">
        <button onClick={() => showToast("Going back...")} className="text-white/80 hover:text-white p-1">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-md text-xs font-semibold cursor-pointer hover:bg-white/20 transition-colors" onClick={() => showToast("Resolution settings opened")}>
          <span>1080P</span>
          <ChevronDown size={14} className="text-white/60" />
        </div>
        
        <div className="flex gap-2">
          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleUploadVideo} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-sm text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <span>Upload</span>}
            {!isUploading && <Upload size={14} />}
          </button>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-[#48E5C2] hover:bg-[#3bc3a4] text-black px-4 py-1.5 rounded-sm text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <span>{exportMessage || 'Export'}</span>}
            {!isExporting && !exportMessage && <Upload size={14} className="rotate-180" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col relative bg-black">
        
        {/* Video Preview */}
        <div className="flex-1 w-full relative flex items-center justify-center bg-black overflow-hidden">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
            muted
            playsInline
            loop
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>

        {/* Playback Controls */}
        <div className="h-12 flex items-center justify-between px-4 bg-[#111111] shrink-0 border-t border-white/5">
          <div className="text-[11px] font-mono text-white/70">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setRotation(r => r - 90)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={24} className="fill-white" /> : <Play size={24} className="fill-white ml-1" />}
            </button>
            <button onClick={() => setRotation(r => r + 90)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
              <RotateCw size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        
      </div>

      {/* Timeline Section */}
      <div className="h-48 bg-[#181818] flex flex-col shrink-0 border-t border-black relative">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-white/5 flex items-center overflow-x-auto no-scrollbar px-2 shrink-0">
          {tools.map((tool, i) => (
            <button 
              key={i}
              onClick={tool.action}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors cursor-pointer rounded-md ${activeTool === tool.label ? 'text-[#48E5C2] bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              {tool.icon}
              <span className="text-[10px] font-medium">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 relative overflow-hidden flex flex-col bg-[#111111] cursor-pointer" onClick={() => {
          if (videoRef.current) {
             videoRef.current.currentTime = (Math.random() * duration);
          }
        }}>
          {/* Ruler */}
          <div className="h-6 border-b border-white/5 relative bg-[#181818] shrink-0 overflow-hidden flex">
             <div className="w-1/2 shrink-0" /> {/* Left padding for playhead */}
             <div className="flex-1 flex items-end pb-1 gap-12 shrink-0 transition-transform duration-100 ease-linear" style={{ transform: `translateX(-${(currentTime / Math.max(duration, 0.1)) * 100}%)`, width: '200%' }}>
               {[0, 5, 10, 15, 20].map(t => (
                 <div key={t} className="relative text-[9px] text-white/40">
                   <div className="absolute -left-0.5 bottom-3 w-px h-1.5 bg-white/20" />
                   {`00:${t.toString().padStart(2, '0')}`}
                 </div>
               ))}
             </div>
          </div>

          {/* Tracks Area */}
          <div className="flex-1 relative overflow-hidden flex">
            <div className="w-1/2 shrink-0 border-r border-white/5" /> {/* Left padding */}
            
            <div 
              className="flex-1 relative h-full pt-4 shrink-0 transition-transform duration-100 ease-linear" 
              style={{ transform: `translateX(-${(currentTime / Math.max(duration, 0.1)) * 100}%)`, width: '200%' }}
            >
              {/* Main Video Track */}
              <div className="h-14 bg-white/10 rounded border border-white/20 mx-1 flex overflow-hidden w-[200px] relative group hover:border-white transition-colors">
                <img src={videoUrl} className="w-24 h-full object-cover opacity-50 pointer-events-none" />
                <img src={videoUrl} className="w-24 h-full object-cover opacity-50 pointer-events-none" />
                <img src={videoUrl} className="w-24 h-full object-cover opacity-50 pointer-events-none" />
                
                {/* Trim Handles */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white rounded-l cursor-ew-resize opacity-0 group-hover:opacity-100 flex items-center justify-center"><div className="w-0.5 h-3 bg-black rounded-full" /></div>
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-r cursor-ew-resize opacity-0 group-hover:opacity-100 flex items-center justify-center"><div className="w-0.5 h-3 bg-black rounded-full" /></div>
              </div>
            </div>
          </div>

          {/* Playhead */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white z-20 pointer-events-none">
            <div className="absolute -top-1 -left-[5px] w-0 h-0 border-l-[5.5px] border-r-[5.5px] border-t-[7px] border-transparent border-t-white" />
          </div>

        </div>

      </div>

    </div>
  );
}
