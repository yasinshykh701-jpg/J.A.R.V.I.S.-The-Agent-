import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Bookmark, Heart, Grid, Lock, Play, Pause, X, Camera, 
  Image as ImageIcon, ChevronLeft, Search, Bell, UserCircle, 
  History, Star, MonitorSmartphone, HelpCircle, Info, Shield, 
  ChevronRight, ChevronDown, CircleUser, Key, AtSign, Cloud, Loader2, Check, Plus, UserPlus, LogOut,
  RotateCw, MessageCircle, Share2, Music2, Eye, Volume2, VolumeX, Menu, MoreHorizontal, Instagram, Link2, HeartOff, MapPin, Send, Smile, Sparkles
} from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { AuthModal } from './AuthModal';

const MOCK_STORIES = [
  {
    id: 'story-1',
    title: 'New Drop',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=400&auto=format&fit=crop',
    time: '2h ago',
    caption: 'New spring collection dropped today! Link in bio 💫',
    unseen: true
  },
  {
    id: 'story-2',
    title: 'BTS 🎬',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    time: '5h ago',
    caption: 'Behind the scenes at today’s photo shoot 📸',
    unseen: true
  },
  {
    id: 'story-3',
    title: 'Q&A 💬',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
    time: '12h ago',
    caption: 'Answering your top questions about our brand ✨',
    unseen: false
  },
  {
    id: 'story-4',
    title: 'Vlog 🌴',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
    time: '1d ago',
    caption: 'Weekend trip highlights! 🌅',
    unseen: false
  },
  {
    id: 'story-5',
    title: 'Events 🎉',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop',
    time: '2d ago',
    caption: 'Pop-up launch event in NYC 🔥',
    unseen: false
  }
];

const MOCK_VIDEOS = [
  { id: '1', videoUrl: '', views: '1234', likes: '182.4K', comments: '1,420', caption: '', pinned: true, sound: '' },
  { id: '2', videoUrl: '', views: '1234', likes: '54.1K', comments: '630', caption: '', pinned: false, sound: '' },
  { id: '3', videoUrl: '', views: '1234', likes: '12.8K', comments: '190', caption: '', pinned: false, sound: '' },
  { id: '4', videoUrl: '', views: '1234', likes: '78.3K', comments: '812', caption: '', pinned: false, sound: '' },
  { id: '5', videoUrl: '', views: '1234', likes: '310.9K', comments: '4,102', caption: '', pinned: false, sound: '' },
  { id: '6', videoUrl: '', views: '1234', likes: '41.5K', comments: '350', caption: '', pinned: false, sound: '' },
  { id: '7', videoUrl: '', views: '1234', likes: '41.5K', comments: '350', caption: '', pinned: false, sound: '' },
  { id: '8', videoUrl: '', views: '1234', likes: '41.5K', comments: '350', caption: '', pinned: false, sound: '' },
  { id: '9', videoUrl: '', views: '1234', likes: '41.5K', comments: '350', caption: '', pinned: false, sound: '' }
];

export interface ProfilePageProps {
  onBackgroundClick?: () => void;
  backendUser: any;
  onLogout: () => void;
  onSuccessAuth: (token: string, user: { email: string; username: string }) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBackgroundClick, backendUser, onLogout, onSuccessAuth }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reposts' | 'private' | 'saved' | 'liked'>('posts');
  const [showSettings, setShowSettings] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop");
  const [wallpaper, setWallpaper] = useState("");
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Active Video Modal state
  const [selectedVideo, setSelectedVideo] = useState<typeof MOCK_VIDEOS[0] | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});

  // Story state
  const [stories, setStories] = useState(MOCK_STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [storyReplyText, setStoryReplyText] = useState('');
  const [storyLikedMap, setStoryLikedMap] = useState<Record<string, boolean>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setIsStoryPaused(false);
    setStories(prev => prev.map((s, i) => i === index ? { ...s, unseen: false } : s));
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setStoryProgress(0);
    setIsStoryPaused(false);
  };

  const handleNextStory = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex < stories.length - 1) {
        const nextIdx = activeStoryIndex + 1;
        setActiveStoryIndex(nextIdx);
        setStoryProgress(0);
        setStories(prev => prev.map((s, i) => i === nextIdx ? { ...s, unseen: false } : s));
      } else {
        closeStory();
      }
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex > 0) {
        const prevIdx = activeStoryIndex - 1;
        setActiveStoryIndex(prevIdx);
        setStoryProgress(0);
      } else {
        setStoryProgress(0);
      }
    }
  };

  const sendEmojiReaction = (emoji: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      left: 15 + Math.random() * 70
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 1200);

    setToastMessage(`Sent reaction ${emoji}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Story progress timer effect
  useEffect(() => {
    if (activeStoryIndex === null || isStoryPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            const nextIdx = activeStoryIndex + 1;
            setActiveStoryIndex(nextIdx);
            setStories(sPrev => sPrev.map((s, i) => i === nextIdx ? { ...s, unseen: false } : s));
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 1.2; // ~4 seconds per story
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isStoryPaused, stories.length]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);

  const handleStoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newStory = {
            id: `story-${Date.now()}`,
            title: 'Your Story',
            image: event.target.result as string,
            time: 'Just now',
            caption: 'New story update! ✨',
            unseen: true
          };
          setStories([newStory, ...stories]);
          openStory(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Rest of the hooks...

  const handleCloudBackup = async () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupSuccess(false);
    
    try {
      const uid = auth.currentUser?.uid;
      
      if (uid) {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          displayName: 'Jane Doe',
          handle: 'janedoe_creator',
          photoURL: profilePhoto,
          wallpaperURL: wallpaper,
          lastBackupAt: serverTimestamp(),
        }, { merge: true });
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    } catch (error) {
      console.error("Backup failed:", error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'wallpaper') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (type === 'profile') setProfilePhoto(event.target.result as string);
          else setWallpaper(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const myVideosWithViews = MOCK_VIDEOS;
  const likedVideosWithViews = MOCK_VIDEOS.slice(2, 6);
  const repostVideos = MOCK_VIDEOS.slice(1, 4);

  return (
    <div 
      className="w-full h-full flex flex-col bg-black text-white overflow-y-auto pb-24 relative"
      style={wallpaper ? {
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {/* Dark overlay for readability if wallpaper is set */}
      {wallpaper && <div className="absolute inset-0 bg-black/80 pointer-events-none" />}
      
      {/* ContentWrapper to keep it above overlay */}
      <div className="relative z-10 w-full flex flex-col max-w-xl mx-auto">
        {/* TikTok Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-[#121212] z-20">
          <button onClick={onBackgroundClick} className="text-white hover:text-white/80 p-1 -ml-1" title="Back">
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>

          <div className="flex items-center justify-center font-bold text-[17px] tracking-tight text-white">
             Your Brand Name
          </div>

          <div className="flex items-center gap-4">
            <button className="text-white hover:text-white/80" title="Notifications">
              <Bell size={24} strokeWidth={1.5} />
            </button>
            <button onClick={() => setShowSettings(true)} className="text-white hover:text-white/80" title="Settings & Menu">
              <MoreHorizontal size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Profile Info - TikTok/Instagram Centered Layout */}
        <div className="flex flex-col items-center px-4 pt-6 pb-3 bg-[#121212]">
          {/* Avatar with Instagram Gradient Ring & Add Badge */}
          <div className="relative mb-3 group cursor-pointer" onClick={() => openStory(0)}>
            <div className="p-[3.5px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-[90px] h-[90px] rounded-full bg-[#c9dbe4] shrink-0 overflow-hidden relative border-2 border-[#121212]">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : null}
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); storyInputRef.current?.click(); }}
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#20D5EC] border-2 border-[#121212] rounded-full flex items-center justify-center text-white hover:bg-[#1bc0d6] active:scale-95 transition-all shadow-md z-10"
              title="Add Story"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              ref={storyInputRef} 
              onChange={handleStoryUpload} 
            />
          </div>
          
          {/* Username handle */}
          <div className="flex items-center gap-1.5 mb-5">
            <span className="font-semibold text-[15px] text-white">
              @yourbrandname
            </span>
            <div className="w-[14px] h-[14px] bg-[#20D5EC] rounded-full flex items-center justify-center">
              <Check size={10} strokeWidth={4} className="text-white" />
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 my-1 text-sm w-full">
            <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
              <span className="font-bold text-white text-[16px]">88</span>
              <span className="text-[13px] text-[#8a8b8e] font-normal">Following</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
              <span className="font-bold text-white text-[16px]">14.2K</span>
              <span className="text-[13px] text-[#8a8b8e] font-normal">Followers</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10"></div>
            <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
              <span className="font-bold text-white text-[16px]">84K</span>
              <span className="text-[13px] text-[#8a8b8e] font-normal">Likes</span>
            </div>
          </div>
          
          {/* Action Button Row */}
          <div className="flex items-center justify-center gap-1.5 w-full max-w-[340px] mb-4 mt-5">
            <button className="flex-1 bg-[#fe2c55] hover:bg-[#e0244a] active:scale-95 text-white py-2.5 rounded-[4px] font-semibold text-[15px] transition-all">
              Follow
            </button>
            <button className="bg-[#333333] hover:bg-[#444444] text-white px-3.5 py-2.5 rounded-[4px] transition-all flex items-center justify-center">
              <Instagram size={20} strokeWidth={1.5} />
            </button>
            <button className="bg-[#333333] hover:bg-[#444444] text-white px-3.5 py-2.5 rounded-[4px] transition-all flex items-center justify-center">
              <ChevronDown size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Bio text (Centered) */}
          <div className="text-center max-w-[320px] mb-2 flex flex-col items-center gap-2">
            <p className="text-[14px] text-white whitespace-pre-line leading-snug">
              👋 A short bio to describe your brand<br />
              🦆 Emojis are supported
            </p>
            <a href="#" className="text-[14px] text-white font-medium flex items-center gap-1.5 hover:underline mt-1">
              <Link2 size={15} strokeWidth={2.5} className="text-white" /> yourbrandwebsite.com
            </a>
          </div>

          {/* Instagram-styled Stories / Highlights Tray */}
          <div className="w-full mt-3 pt-3 border-t border-white/10 flex items-center gap-3.5 overflow-x-auto no-scrollbar px-2 pb-1">
            {/* Add Story Button */}
            <div 
              onClick={() => storyInputRef.current?.click()}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              <div className="w-[62px] h-[62px] rounded-full border-2 border-dashed border-white/30 bg-[#222222] flex items-center justify-center group-hover:border-[#ee2a7b] group-hover:bg-[#2b2b2b] transition-all">
                <Plus size={22} className="text-[#ee2a7b]" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] text-white/80 font-medium">Add Story</span>
            </div>

            {/* Active Stories Items */}
            {stories.map((story, index) => (
              <div 
                key={story.id} 
                onClick={() => openStory(index)}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
              >
                <div className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${story.unseen ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' : 'border border-white/30 bg-black'}`}>
                  <div className="w-[58px] h-[58px] rounded-full overflow-hidden bg-[#222222] border-2 border-[#121212]">
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[11px] text-white/90 font-medium truncate max-w-[68px] text-center">{story.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TikTok Tab Navigation Bar */}
        <div className="flex border-t border-white/5 bg-[#171717] sticky top-[52px] z-10">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex flex-col items-center justify-center transition-all relative ${activeTab === 'posts' ? 'text-white' : 'text-[#8a8b8e] hover:text-white/80'}`}
            title="Videos"
          >
            <Grid size={22} strokeWidth={activeTab === 'posts' ? 2 : 1.5} />
            {activeTab === 'posts' && <div className="absolute bottom-0 w-[45%] h-[2px] bg-white"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-3 flex flex-col items-center justify-center transition-all relative ${activeTab === 'liked' ? 'text-white' : 'text-[#8a8b8e] hover:text-white/80'}`}
            title="Liked videos"
          >
            <HeartOff size={22} strokeWidth={activeTab === 'liked' ? 2 : 1.5} />
            {activeTab === 'liked' && <div className="absolute bottom-0 w-[45%] h-[2px] bg-white"></div>}
          </button>
        </div>

        {/* TikTok Video Grid */}
        <div className="grid grid-cols-3 gap-[1px] bg-black">
          {activeTab === 'posts' && myVideosWithViews.map((video) => (
            <div 
              key={video.id} 
              className="aspect-[3/4] bg-gradient-to-b from-[#d8e3ea] to-[#abc1ce] relative group overflow-hidden"
            >
              {/* Play count overlay */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[13px] font-semibold text-white drop-shadow-md">
                <Play size={12} fill="transparent" className="stroke-white stroke-[2.5px]" />
                <span className="tracking-wide leading-none pt-0.5">{video.views}</span>
              </div>

              {/* TikTok Pinned Badge */}
              {video.pinned && (
                <div className="absolute top-0 left-0 bg-[#eb4b5a] text-white text-[12px] font-semibold px-1.5 py-0.5 rounded-br-sm shadow-sm z-10 leading-snug">
                  Pinned
                </div>
              )}
            </div>
          ))}

          {activeTab === 'liked' && likedVideosWithViews.map((video) => (
            <div 
              key={video.id} 
              className="aspect-[3/4] bg-gradient-to-b from-[#d8e3ea] to-[#abc1ce] relative group overflow-hidden"
            >
              {/* Play count overlay */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[13px] font-semibold text-white drop-shadow-md">
                <Play size={12} fill="transparent" className="stroke-white stroke-[2.5px]" />
                <span className="tracking-wide leading-none pt-0.5">{video.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen TikTok Video Viewer Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in">
          <div className="relative w-full max-w-md h-full max-h-[92vh] bg-black flex flex-col justify-between overflow-hidden sm:rounded-2xl border border-white/10 shadow-2xl">
            {/* Video Player */}
            <div className="absolute inset-0 z-0 cursor-pointer" onClick={togglePlayPause}>
              <video 
                ref={videoRef}
                src={selectedVideo.videoUrl} 
                className="w-full h-full object-cover" 
                autoPlay 
                loop 
                muted={isMuted} 
                playsInline 
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                  <Play size={72} fill="white" className="text-white opacity-80" />
                </div>
              )}
            </div>

            {/* Top Bar Controls */}
            <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
              <button 
                onClick={() => setSelectedVideo(null)} 
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors pointer-events-auto"
              >
                <X size={20} />
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors pointer-events-auto"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            {/* Right Action Icons Sidebar (TikTok style) */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-10">
              {/* Creator Avatar */}
              <div className="relative cursor-pointer">
                <img src={profilePhoto} alt="Creator" className="w-11 h-11 rounded-full border-2 border-white object-cover" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#fe2c55] rounded-full p-0.5">
                  <Plus size={10} className="text-white" />
                </div>
              </div>

              {/* Like Button */}
              <button 
                onClick={() => setIsLiked(prev => ({ ...prev, [selectedVideo.id]: !prev[selectedVideo.id] }))}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-md group-hover:bg-black/50 transition-colors">
                  <Heart 
                    size={28} 
                    className={isLiked[selectedVideo.id] ? "fill-[#fe2c55] text-[#fe2c55]" : "text-white"} 
                  />
                </div>
                <span className="text-xs font-bold text-white drop-shadow">{selectedVideo.likes}</span>
              </button>

              {/* Comments Button */}
              <button className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-md group-hover:bg-black/50 transition-colors">
                  <MessageCircle size={28} className="text-white fill-white/20" />
                </div>
                <span className="text-xs font-bold text-white drop-shadow">{selectedVideo.comments}</span>
              </button>

              {/* Bookmark Button */}
              <button className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-md group-hover:bg-black/50 transition-colors">
                  <Bookmark size={28} className="text-white fill-white/20" />
                </div>
                <span className="text-xs font-bold text-white drop-shadow">Save</span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="p-2 rounded-full bg-black/30 backdrop-blur-md group-hover:bg-black/50 transition-colors">
                  <Share2 size={28} className="text-white" />
                </div>
                <span className="text-xs font-bold text-white drop-shadow">Share</span>
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 z-10 pr-16 pointer-events-none">
              <h3 className="font-bold text-white text-base">@{backendUser?.username || 'janedoe_creator'}</h3>
              <p className="text-sm text-white/90 leading-snug line-clamp-2">{selectedVideo.caption}</p>
              
              <div className="flex items-center gap-2 text-xs text-white/80 font-medium mt-1">
                <Music2 size={14} className="animate-spin duration-3000" />
                <span>{selectedVideo.sound}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-right sm:slide-in-from-bottom-0 overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sticky top-0 bg-black z-10 border-b border-white/10">
            <button onClick={() => setShowSettings(false)} className="text-white hover:text-white/80 p-1">
              <ChevronLeft size={28} />
            </button>
            <h2 className="font-bold text-lg flex-1 ml-4">Settings and privacy</h2>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3">
            <div className="relative flex items-center w-full h-10 rounded-xl bg-white/10 overflow-hidden">
              <div className="pl-3 text-white/50">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full h-full bg-transparent border-none text-white px-3 text-[15px] focus:outline-none placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Quick Actions (Wallpaper/Photo) */}
          <div className="px-4 py-2 flex gap-3 overflow-x-auto no-scrollbar mb-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <Camera size={16} />
              Change Photo
            </button>
            <button 
              onClick={() => wallpaperInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <ImageIcon size={16} />
              Change Wallpaper
            </button>
            {wallpaper && (
              <button 
                onClick={() => setWallpaper("")}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                <X size={16} />
                Remove Wallpaper
              </button>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={wallpaperInputRef} 
              onChange={(e) => handlePhotoUpload(e, 'wallpaper')} 
            />
          </div>

          {/* Sections */}
          <div className="flex flex-col pb-10">
            {/* Account Center */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Account</span>
              </div>
              
              <div className="mt-3 flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <UserCircle size={24} className="text-white/80" />
                  <span className="text-[15px]">User Account Center</span>
                </div>
                <ChevronRight size={20} className="text-white/30" />
              </div>
            </div>

            <div className="h-2 w-full bg-white/5 my-2" />

            {/* How you use TikTok */}
            <div className="px-4 py-2">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Content & Display</span>
              
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bookmark size={24} className="text-white/80" />
                    <span className="text-[15px]">Saved</span>
                  </div>
                  <ChevronRight size={20} className="text-white/30" />
                </div>
                
                <div className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <History size={24} className="text-white/80" />
                    <span className="text-[15px]">Watch history</span>
                  </div>
                  <ChevronRight size={20} className="text-white/30" />
                </div>

                <div className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors" onClick={handleCloudBackup}>
                  <div className="flex items-center gap-3">
                    <Cloud size={24} className="text-white/80" />
                    <span className="text-[15px]">Cloud backup</span>
                  </div>
                  {isBackingUp ? (
                    <Loader2 size={20} className="text-white/50 animate-spin" />
                  ) : backupSuccess ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <ChevronRight size={20} className="text-white/30" />
                  )}
                </div>

                <div 
                  className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                  onClick={() => {
                    setShowSettings(false);
                    onBackgroundClick?.();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon size={24} className="text-purple-400" />
                    <span className="text-[15px]">Change App Background</span>
                  </div>
                  <ChevronRight size={20} className="text-white/30" />
                </div>
              </div>
            </div>

            <div className="h-2 w-full bg-white/5 my-4" />

            {/* Privacy */}
            <div className="px-4 py-2">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Privacy</span>
              
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock size={24} className="text-white/80" />
                    <span className="text-[15px]">Privacy settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50">Public</span>
                    <ChevronRight size={20} className="text-white/30" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-2 w-full bg-white/5 my-4" />
            
            {/* Login */}
            <div className="px-4 py-2">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Login</span>
              
              <div className="mt-4 flex flex-col gap-2">
                <div 
                  onClick={() => { setShowSettings(false); setShowAuthModal(true); }}
                  className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus size={24} className="text-blue-500" />
                    <span className="text-[15px] text-blue-500 font-semibold">
                      {backendUser ? `Logged in as ${backendUser.username}` : 'Add account'}
                    </span>
                  </div>
                </div>
                <div 
                  onClick={() => {
                    setShowSettings(false);
                    onLogout();
                  }}
                  className="flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={24} className="text-red-500" />
                    <span className="text-[15px] text-red-500 font-semibold">Log out @{backendUser?.username || 'janedoe_creator'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={(token, userEmail) => {
          localStorage.setItem('backend_token', token);
          onSuccessAuth(token, { email: userEmail, username: userEmail.split('@')[0] });
        }}
      />

      {/* Fullscreen Instagram Story Viewer Modal */}
      {selectedStory && activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in">
          {/* Floating Emoji Reaction Elements */}
          {floatingEmojis.map(item => (
            <div 
              key={item.id}
              className="fixed bottom-32 z-50 text-4xl pointer-events-none animate-bounce transition-all duration-1000 ease-out"
              style={{ left: `${item.left}%`, transform: 'translateY(-120px)', opacity: 0.9 }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Toast Message Notification */}
          {toastMessage && (
            <div className="fixed top-12 z-50 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-2">
              {toastMessage}
            </div>
          )}

          <div className="relative w-full max-w-md h-full max-h-[92vh] bg-black flex flex-col justify-between overflow-hidden sm:rounded-2xl border border-white/10 shadow-2xl select-none">
            {/* Top Multi-Segment Instagram Progress Bar */}
            <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
              {stories.map((s, idx) => {
                let fillWidth = '0%';
                if (idx < activeStoryIndex) fillWidth = '100%';
                else if (idx === activeStoryIndex) fillWidth = `${storyProgress}%`;

                return (
                  <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-75 ease-linear"
                      style={{ width: fillWidth }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Story Header */}
            <div className="absolute top-6 inset-x-0 px-4 py-2 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="p-[1.5px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#121212] overflow-hidden border border-black">
                    {profilePhoto ? <img src={profilePhoto} alt="User" className="w-full h-full object-cover" /> : null}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm tracking-tight">yourbrandname</span>
                    <div className="w-3.5 h-3.5 bg-[#20D5EC] rounded-full flex items-center justify-center">
                      <Check size={8} strokeWidth={4} className="text-white" />
                    </div>
                    <span className="text-xs text-white/60 font-medium ml-1">• {selectedStory.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsStoryPaused(!isStoryPaused)} 
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 transition-colors"
                  title={isStoryPaused ? "Play" : "Pause"}
                >
                  {isStoryPaused ? <Play size={16} fill="white" /> : <Pause size={16} />}
                </button>
                <button 
                  onClick={closeStory} 
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 transition-colors"
                  title="Close Story"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Interactive Image Display & Touch Navigation Area */}
            <div 
              className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer group"
              onMouseDown={() => setIsStoryPaused(true)}
              onMouseUp={() => setIsStoryPaused(false)}
              onTouchStart={() => setIsStoryPaused(true)}
              onTouchEnd={() => setIsStoryPaused(false)}
              onDoubleClick={() => sendEmojiReaction('❤️')}
            >
              <img 
                src={selectedStory.image} 
                alt={selectedStory.title} 
                className="w-full h-full object-cover"
              />

              {/* Left Tap Zone for Previous Story */}
              <div 
                onClick={(e) => { e.stopPropagation(); handlePrevStory(); }} 
                className="absolute left-0 top-0 bottom-0 w-[35%] z-20 cursor-pointer" 
              />

              {/* Right Tap Zone for Next Story */}
              <div 
                onClick={(e) => { e.stopPropagation(); handleNextStory(); }} 
                className="absolute right-0 top-0 bottom-0 w-[65%] z-20 cursor-pointer" 
              />

              {/* Caption Overlay */}
              {selectedStory.caption && (
                <div className="absolute bottom-28 inset-x-4 p-3 bg-black/70 backdrop-blur-md rounded-xl text-white text-sm font-medium border border-white/10 shadow-lg z-20 pointer-events-none">
                  {selectedStory.caption}
                </div>
              )}
            </div>

            {/* Bottom Interactive Area - Quick Reactions & Message Input */}
            <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 z-30">
              {/* Instagram Quick Emoji Reaction Bar */}
              <div className="flex items-center justify-around px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15">
                {['❤️', '🔥', '😂', '😮', '😢', '👏'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => sendEmojiReaction(emoji)}
                    className="text-xl hover:scale-125 active:scale-90 transition-transform p-1"
                    title={`React ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-2.5 mt-1">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder={`Send message to yourbrandname...`} 
                    value={storyReplyText}
                    onChange={(e) => setStoryReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && storyReplyText.trim()) {
                        setToastMessage(`Message sent: "${storyReplyText}"`);
                        setStoryReplyText('');
                        setTimeout(() => setToastMessage(null), 2500);
                      }
                    }}
                    className="w-full bg-white/15 border border-white/20 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/60 focus:outline-none focus:border-[#ee2a7b] transition-all"
                  />
                </div>
                <button 
                  onClick={() => {
                    const isLiked = !!storyLikedMap[selectedStory.id];
                    setStoryLikedMap(prev => ({ ...prev, [selectedStory.id]: !isLiked }));
                    if (!isLiked) sendEmojiReaction('❤️');
                  }}
                  className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                  title="Like Story"
                >
                  <Heart 
                    size={20} 
                    className={storyLikedMap[selectedStory.id] ? "text-[#ee2a7b] fill-[#ee2a7b]" : "text-white"} 
                  />
                </button>
                <button 
                  onClick={() => {
                    if (storyReplyText.trim()) {
                      setToastMessage(`Message sent: "${storyReplyText}"`);
                      setStoryReplyText('');
                      setTimeout(() => setToastMessage(null), 2500);
                    } else {
                      sendEmojiReaction('❤️');
                    }
                  }}
                  className="p-2.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white transition-opacity shadow-md"
                  title="Send"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
