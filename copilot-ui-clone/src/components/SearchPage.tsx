import React, { useState, useEffect } from 'react';
import { Search, Play, Heart, MessageCircle, X, Clock, Video, Image, User, Music, Gamepad2, Code, Map, Hash } from 'lucide-react';

const getSearchIcon = (query: string) => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.match(/video|movie|clip|reel|mp4/)) return <Video size={16} className="text-neutral-400" />;
  if (lowerQuery.match(/image|photo|pic|jpeg|jpg|png/)) return <Image size={16} className="text-neutral-400" />;
  if (lowerQuery.match(/user|profile|person|friend/)) return <User size={16} className="text-neutral-400" />;
  if (lowerQuery.match(/music|song|audio|sound|mp3/)) return <Music size={16} className="text-neutral-400" />;
  if (lowerQuery.match(/game|play|gaming/)) return <Gamepad2 size={16} className="text-neutral-400" />;
  if (lowerQuery.match(/code|dev|script|html|css|js|python/)) return <Code size={16} className="text-neutral-400" />;
  if (lowerQuery.match(/map|location|place|city/)) return <Map size={16} className="text-neutral-400" />;
  if (lowerQuery.startsWith('#')) return <Hash size={16} className="text-neutral-400" />;
  return <Clock size={16} className="text-neutral-400" />;
};

const exploreItems = [
  { id: 1, type: 'video', url: '/nature.mp4', span: 'col-span-2 row-span-2' },
  { id: 2, type: 'image', url: '/kungfu panda.jpeg', span: 'col-span-1 row-span-1' },
  { id: 3, type: 'video', url: '/animation1.mp4', span: 'col-span-1 row-span-1' },
  { id: 4, type: 'image', url: '/images (1).jpg', span: 'col-span-1 row-span-1' },
  { id: 5, type: 'video', url: '/gaming_background.mp4', span: 'col-span-1 row-span-1' },
  { id: 6, type: 'image', url: '/images.jpg', span: 'col-span-1 row-span-1' },
  { id: 7, type: 'video', url: '/kungfu panda.mp4', span: 'col-span-2 row-span-2' },
  { id: 8, type: 'image', url: '/sddefault.jpg', span: 'col-span-1 row-span-1' },
  { id: 9, type: 'video', url: '/avtar21.mp4', span: 'col-span-1 row-span-1' },
  { id: 10, type: 'video', url: '/background.mp4', span: 'col-span-1 row-span-1' },
  { id: 11, type: 'video', url: '/kungfu_final.mp4', span: 'col-span-1 row-span-1' },
  { id: 12, type: 'video', url: '/kungfu2.mp4', span: 'col-span-1 row-span-1' },
  { id: 13, type: 'video', url: '/kungfu panda 3.mp4', span: 'col-span-1 row-span-1' },
  { id: 14, type: 'video', url: '/animation1-1.mp4', span: 'col-span-1 row-span-1' },
  { id: 15, type: 'video', url: '/Animation 5 logo.mp4', span: 'col-span-1 row-span-1' },
  { id: 16, type: 'video', url: '/Logo 4 animation.mp4', span: 'col-span-2 row-span-2' },
  { id: 17, type: 'video', url: '/Avtar2.mp4', span: 'col-span-1 row-span-1' },
  { id: 18, type: 'image', url: '/sunflowers_summer_sky.jpg', span: 'col-span-1 row-span-1' },
  { id: 19, type: 'video', url: '/3ba8cd5d24551dffb479fbade8b11259-6dfa0489-e4cb-4da9-ba58-06e452d60584.mp4', span: 'col-span-1 row-span-1' },
  { id: 20, type: 'video', url: '/5578794f76d05de3ec8b7dd608e04d62-2be50e41-505a-4853-9a86-b1c8136ac50f.mp4', span: 'col-span-1 row-span-1' },
  { id: 21, type: 'video', url: '/6cfbda901171d048617771563387e9ba-d1e91a66-8830-4e82-9ac8-eac5da9bd5e2 (1).mp4', span: 'col-span-1 row-span-1' },
  { id: 22, type: 'image', url: '/input_badge_bg.jpg', span: 'col-span-1 row-span-1' },
  { id: 23, type: 'image', url: '/WhatsApp Image 2026-07-19 at 11.23.41 PM.jpeg', span: 'col-span-2 row-span-2' },
];

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    const newSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    setSearchQuery(query);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(searchQuery);
    }
  };

  const removeSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    const newSearches = recentSearches.filter(s => s !== query);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full max-w-4xl mx-auto py-6 relative">
      <div className="relative mb-8 w-full max-w-lg mx-auto z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          className="w-full bg-bg shadow-neu-sm-inset border border-white/50 rounded-full py-3.5 pl-12 pr-4 text-ink placeholder-neutral-400 focus:outline-none focus:shadow-neu-inset transition-all"
        />
        
        {isFocused && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-ink-faint rounded-2xl overflow-hidden shadow-neu-lg z-30 p-1">
            <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-ink-faint">
              Recent Searches
            </div>
            <ul>
              {recentSearches.map((query, idx) => (
                <li 
                  key={idx}
                  className="flex items-center justify-between px-4 py-3 hover:bg-bg rounded-xl cursor-pointer transition-all text-neutral-600 hover:text-ink font-medium"
                  onMouseDown={() => handleSearchSubmit(query)}
                >
                  <div className="flex items-center gap-3">
                    {getSearchIcon(query)}
                    <span>{query}</span>
                  </div>
                  <button 
                    onMouseDown={(e) => removeSearch(e, query)}
                    className="p-1 rounded-full hover:bg-white text-neutral-400 hover:text-accent transition-colors"
                    title="Remove from history"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 z-10 p-2">
        <div className="grid grid-cols-3 gap-4 auto-rows-[minmax(120px,1fr)] md:auto-rows-[minmax(200px,1fr)]">
          {exploreItems.map((item) => (
            <div 
              key={item.id} 
              className={`relative group bg-bg rounded-3xl overflow-hidden cursor-pointer shadow-neu-sm hover:shadow-neu-flat hover:scale-[1.01] transition-all duration-300 border border-white/50 ${item.span}`}
            >
              {item.type === 'video' ? (
                <>
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  <div className="absolute top-3 right-3 text-white bg-black/30 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                    <Play size={16} fill="currentColor" />
                  </div>
                </>
              ) : (
                <img 
                  src={item.url} 
                  alt="Explore content" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-ink font-bold drop-shadow-sm">
                  <Heart size={20} className="fill-accent text-accent" />
                  <span>{Math.floor(Math.random() * 900) + 100}</span>
                </div>
                <div className="flex items-center gap-2 text-ink font-bold drop-shadow-sm">
                  <MessageCircle size={20} className="fill-blue-500 text-blue-500" />
                  <span>{Math.floor(Math.random() * 100) + 10}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
