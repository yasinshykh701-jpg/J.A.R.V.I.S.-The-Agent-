import React, { useState, useRef, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Music, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Search, 
  Tv, 
  Send, 
  X,
  Sparkles,
  Scissors,
  ExternalLink,
  Video
} from 'lucide-react';

interface TikTokVideo {
  id: string;
  videoUrl: string;
  posterUrl: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
    isFollowing?: boolean;
  };
  description: string;
  hashtags: string[];
  songName: string;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  comments: Array<{
    id: string;
    user: string;
    avatar: string;
    text: string;
    likes: number;
    time: string;
    isLiked?: boolean;
  }>;
}

const SAMPLE_VIDEOS: TikTokVideo[] = [
  {
    id: '1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'ZarZayn AI Studio',
      handle: 'zarzayn_official',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      isFollowing: false,
    },
    description: 'Welcome to the future of AI interfaces ✨ Cyberpunk aesthetics meets full interactivity.',
    hashtags: ['fyp', 'cyberpunk', 'aistudio', 'zarzayn', 'futureui'],
    songName: 'ZarZayn Cyber Synthwave - Original Audio',
    likes: 184200,
    commentsCount: 3240,
    sharesCount: 15800,
    savesCount: 42100,
    comments: [
      { id: 'c1', user: 'Alex_Dev', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', text: 'This UI animation is unbelievable! 🔥', likes: 420, time: '2h' },
      { id: 'c2', user: 'Elena_Vibes', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', text: 'Where can I get this template??', likes: 185, time: '1h' },
      { id: 'c3', user: 'NeoRider', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', text: 'Smooth as silk on mobile 🚀', likes: 92, time: '30m' },
    ]
  },
  {
    id: '2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Cosmic Wonders',
      handle: 'deep_space_explorer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      isFollowing: true,
    },
    description: 'Drifting into deep galaxy realms 🌌 Turn volume UP for spatial sound immersion.',
    hashtags: ['galaxy', 'space', 'meditation', 'cosmic', 'astronomy'],
    songName: 'Deep Ambient Void - Solar Frequencies',
    likes: 312800,
    commentsCount: 5410,
    sharesCount: 28900,
    savesCount: 89400,
    comments: [
      { id: 'c4', user: 'Starlight_99', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', text: 'Watching this at 3 AM is magic ✨', likes: 1240, time: '5h' },
      { id: 'c5', user: 'OrbitX', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100', text: 'Space is mindblowing', likes: 310, time: '3h' },
    ]
  },
  {
    id: '3',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Zen Nature Realm',
      handle: 'serene_vibes',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      isVerified: false,
      isFollowing: false,
    },
    description: 'Take 3 deep breaths right now... 🍃 Let go of all stress.',
    hashtags: ['mindfulness', 'nature', 'calm', 'peace', 'relax'],
    songName: 'Forest Rain & Wind Flute - Zen Chimes',
    likes: 95400,
    commentsCount: 1280,
    sharesCount: 4300,
    savesCount: 19800,
    comments: [
      { id: 'c6', user: 'PeaceSeeker', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', text: 'Needed this exact pause today, thank you 🙏', likes: 520, time: '4h' },
    ]
  }
];

interface TikTokFeedProps {
  onOpenVpn?: () => void;
  isVpnConnected?: boolean;
  onOpenCapCut?: (videoUrl?: string, title?: string) => void;
}

export const TikTokFeed: React.FC<TikTokFeedProps> = ({ onOpenVpn, isVpnConnected = true, onOpenCapCut }) => {
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou');
  const [videos, setVideos] = useState<TikTokVideo[]>(SAMPLE_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnimation, setShowHeartAnimation] = useState<{ x: number; y: number } | null>(null);
  const [activeCommentsVideo, setActiveCommentsVideo] = useState<TikTokVideo | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbVideos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TikTokVideo[];
      setVideos([...dbVideos, ...SAMPLE_VIDEOS]);
    });
    return () => unsubscribe();
  }, []);

  // Play/Pause active video when visible
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex && isPlaying) {
        video.play().catch(() => {
          // Auto-play policy standard catch
        });
      } else {
        video.pause();
      }
    });
  }, [currentIndex, isPlaying]);

  // Handle scroll snap index detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const newIdx = Math.round(scrollTop / clientHeight);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < videos.length) {
      setCurrentIndex(newIdx);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>, videoId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setShowHeartAnimation({ x, y });
    setTimeout(() => setShowHeartAnimation(null), 800);

    // Like video
    toggleLike(videoId, true);
  };

  const toggleLike = (videoId: string, forceLike = false) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const isCurrentlyLiked = v.comments.some(() => false); // tracking video like state
        const isLikedNow = forceLike ? true : !(v as any).isLiked;
        const diff = isLikedNow ? ((v as any).isLiked ? 0 : 1) : -1;
        return {
          ...v,
          likes: Math.max(0, v.likes + diff),
          isLiked: isLikedNow
        } as TikTokVideo;
      }
      return v;
    }));
  };

  const toggleSave = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const isSavedNow = !(v as any).isSaved;
        return {
          ...v,
          savesCount: v.savesCount + (isSavedNow ? 1 : -1),
          isSaved: isSavedNow
        } as TikTokVideo;
      }
      return v;
    }));
  };

  const toggleFollow = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          author: {
            ...v.author,
            isFollowing: !v.author.isFollowing
          }
        };
      }
      return v;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsVideo) return;

    const newComment = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: newCommentText.trim(),
      likes: 0,
      time: 'Just now'
    };

    setVideos(prev => prev.map(v => {
      if (v.id === activeCommentsVideo.id) {
        return {
          ...v,
          commentsCount: v.commentsCount + 1,
          comments: [newComment, ...v.comments]
        };
      }
      return v;
    }));

    setActiveCommentsVideo(prev => prev ? {
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [newComment, ...prev.comments]
    } : null);

    setNewCommentText('');
  };

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col select-none">
      
      {/* Top Header Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-4 py-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (onOpenCapCut) {
                onOpenCapCut(videos[currentIndex]?.videoUrl, videos[currentIndex]?.description);
              } else {
                window.open("https://www.capcut.com/editor", "_blank");
              }
            }}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold transition-all hover:scale-105 shadow-lg group cursor-pointer"
            title="Open CapCut Studio"
          >
            <Scissors size={14} className="text-amber-400 rotate-45 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">CapCut Studio</span>
            <ExternalLink size={10} className="text-white/60" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <button 
            onClick={() => setActiveTab('following')}
            className={`transition-all relative py-1 ${activeTab === 'following' ? 'text-white font-bold scale-105' : 'text-white/60 hover:text-white/90'}`}
          >
            Following
            {activeTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
            )}
          </button>
          <span className="text-white/20">|</span>
          <button 
            onClick={() => setActiveTab('foryou')}
            className={`transition-all relative py-1 ${activeTab === 'foryou' ? 'text-white font-bold scale-105' : 'text-white/60 hover:text-white/90'}`}
          >
            For You
            {activeTab === 'foryou' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>
        </div>

        <button className="text-white/80 hover:text-white p-1">
          <Search size={22} />
        </button>
      </div>

      {/* Vertical Snap Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-none relative"
      >
        {videos.map((video, index) => {
          const isLiked = (video as any).isLiked;
          const isSaved = (video as any).isSaved;

          return (
            <div 
              key={video.id}
              className="w-full h-full snap-start snap-always relative bg-neutral-900 flex items-center justify-center overflow-hidden"
              onClick={(e) => handleDoubleTap(e, video.id)}
            >
              {/* Video Element */}
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={video.videoUrl}
                poster={video.posterUrl}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Tap Play/Pause Indicator Overlay */}
              {!isPlaying && currentIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <div className="w-16 h-16 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 animate-pulse">
                    <Play size={36} className="ml-1 fill-white" />
                  </div>
                </div>
              )}

              {/* Double Tap Floating Heart Animation */}
              {showHeartAnimation && currentIndex === index && (
                <div 
                  className="absolute z-40 pointer-events-none animate-ping"
                  style={{ left: showHeartAnimation.x - 30, top: showHeartAnimation.y - 30 }}
                >
                  <Heart size={60} className="fill-red-500 text-red-500 drop-shadow-lg" />
                </div>
              )}

              {/* Video Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-10" />

              {/* Mute/Unmute Toggle Button */}
              <button 
                onClick={toggleMute}
                className="absolute top-16 right-4 z-20 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white border border-white/10"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {/* Right Action Sidebar */}
              <div className="absolute right-3 bottom-12 z-20 flex flex-col items-center gap-5">
                
                {/* Creator Avatar with Follow Button */}
                <div className="relative mb-2">
                  <img 
                    src={video.author.avatar} 
                    alt={video.author.name} 
                    className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(video.id);
                    }}
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all shadow-md ${
                      video.author.isFollowing ? 'bg-green-500 scale-90' : 'bg-red-500 hover:scale-110'
                    }`}
                  >
                    {video.author.isFollowing ? <Check size={12} /> : <Plus size={14} />}
                  </button>
                </div>

                {/* Like Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(video.id);
                  }}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    isLiked ? 'bg-red-500/20 text-red-500 scale-110' : 'bg-black/40 backdrop-blur-md text-white hover:bg-black/60'
                  }`}>
                    <Heart size={24} className={`transition-all ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-white tracking-tight">{formatCount(video.likes)}</span>
                </button>

                {/* Comment Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentsVideo(video);
                  }}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-[11px] font-semibold text-white tracking-tight">{formatCount(video.commentsCount)}</span>
                </button>

                {/* Save / Bookmark Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(video.id);
                  }}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    isSaved ? 'bg-amber-500/20 text-amber-400 scale-110' : 'bg-black/40 backdrop-blur-md text-white hover:bg-black/60'
                  }`}>
                    <Bookmark size={24} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />
                  </div>
                  <span className="text-[11px] font-semibold text-white tracking-tight">{formatCount(video.savesCount)}</span>
                </button>

                {/* Share Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({ title: video.description, url: window.location.href }).catch(() => {});
                    }
                  }}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all">
                    <Share2 size={24} />
                  </div>
                  <span className="text-[11px] font-semibold text-white tracking-tight">{formatCount(video.sharesCount)}</span>
                </button>

                {/* Rotating Music Disc */}
                <div className="mt-2 relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-white/80 p-1 animate-spin duration-3000 shadow-xl overflow-hidden flex items-center justify-center">
                    <img src={video.author.avatar} alt="sound" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <Sparkles size={12} className="absolute -top-2 -left-2 text-amber-300 animate-bounce" />
                </div>

              </div>

              {/* Bottom Left Details Overlay */}
              <div className="absolute left-4 bottom-5 right-20 z-20 flex flex-col gap-2 text-left">
                {/* CapCut Template Link Badge */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenCapCut) {
                      onOpenCapCut(video.videoUrl, `Template: ${video.description}`);
                    } else {
                      window.open("https://www.capcut.com/editor", "_blank");
                    }
                  }}
                  className="flex items-center gap-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-md text-xs font-semibold w-fit transition-all hover:scale-105 hover:border-amber-400 group/capcut shadow-md cursor-pointer"
                >
                  <Scissors size={14} className="text-amber-400 rotate-45 group-hover/capcut:scale-110 transition-transform" />
                  <span>CapCut · Try this template</span>
                  <ExternalLink size={10} className="text-white/60 ml-0.5" />
                </button>

                {/* Author Name */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base hover:underline cursor-pointer">
                    @{video.author.handle}
                  </span>
                  {video.author.isVerified && (
                    <span className="bg-blue-500 text-white p-0.5 rounded-full text-[10px]">✓</span>
                  )}
                </div>

                {/* Description & Hashtags */}
                <p className="text-white/90 text-sm line-clamp-2 leading-snug font-normal">
                  {video.description}{' '}
                  {video.hashtags.map(h => (
                    <span key={h} className="font-bold text-white hover:underline mr-1.5 cursor-pointer">
                      #{h}
                    </span>
                  ))}
                </p>

                {/* Audio Ticker */}
                <div className="flex items-center gap-2 text-white/80 text-xs font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit max-w-[200px]">
                  <Music size={12} className="animate-spin text-amber-400 shrink-0" />
                  <span className="truncate">{video.songName}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Slide-Up Comments Modal Drawer */}
      {activeCommentsVideo && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div 
            className="w-full h-[65%] bg-neutral-900 border-t border-white/20 rounded-t-3xl flex flex-col p-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-white text-xs font-bold uppercase tracking-wider text-center flex-1">
                {activeCommentsVideo.commentsCount} Comments
              </span>
              <button 
                onClick={() => setActiveCommentsVideo(null)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
              {activeCommentsVideo.comments.map(c => (
                <div key={c.id} className="flex gap-3 items-start">
                  <img src={c.avatar} alt={c.user} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 font-semibold text-xs">{c.user}</span>
                      <span className="text-white/40 text-[10px]">{c.time}</span>
                    </div>
                    <p className="text-white/90 text-xs mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                  <button className="flex flex-col items-center text-white/40 hover:text-red-500 transition-colors">
                    <Heart size={14} />
                    <span className="text-[9px] mt-0.5">{c.likes}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
              <button 
                type="submit"
                disabled={!newCommentText.trim()}
                className="w-8 h-8 rounded-full bg-amber-400 disabled:opacity-30 text-black flex items-center justify-center transition-all shrink-0 font-bold"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
