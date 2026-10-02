import React, { useState } from 'react';
import { MapPin, Navigation, Search, X, Sparkles } from 'lucide-react';

interface MapsGroundingServiceProps {
  onClose?: () => void;
  onQuerySubmit: (query: string) => void;
}

export function MapsGroundingService({ onClose, onQuerySubmit }: MapsGroundingServiceProps) {
  const [mapQuery, setMapQuery] = useState('');

  const sampleQueries = [
    'Find best ramen restaurants nearby',
    'Route and navigation options to the airport',
    'Top scenic parks and landmarks to visit',
    'Coffee shops with free wifi and quiet workspaces'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapQuery.trim()) {
      onQuerySubmit(mapQuery.trim());
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 flex flex-col gap-3 text-white backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
            <MapPin size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide uppercase text-white">Google Maps Grounding</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                gemini-3.5-flash + googleMaps
              </span>
            </div>
            <p className="text-[11px] text-white/60">Grounded geospatial intelligence, local business search & routes</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={mapQuery}
            onChange={(e) => setMapQuery(e.target.value)}
            placeholder="Search locations, routes, nearby places..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder:text-white/35 focus:outline-none focus:border-blue-400 transition-colors"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-white/40" />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles size={12} /> Ground Query
        </button>
      </form>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {sampleQueries.map((query, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onQuerySubmit(query)}
            className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <Navigation size={10} className="text-blue-300" />
            {query}
          </button>
        ))}
      </div>

      {/* Live Map Preview Frame */}
      <div className="w-full h-40 rounded-xl overflow-hidden border border-white/15 relative bg-slate-900 mt-1">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15168.866164478199!2d75.0260663!3d18.10778880000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1784232289578!5m2!1sen!2sin"
          className="w-full h-full border-none"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
