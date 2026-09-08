import React from 'react';
import { Flame, Play, Info, Heart, Star } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroBannerProps {
  featuredItem: MediaItem;
  upNextItems: MediaItem[];
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWatch: (item: MediaItem) => void;
  onMoreInfo: (item: MediaItem) => void;
  onSelectFeatured: (item: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredItem,
  upNextItems,
  isFavorite,
  onToggleFavorite,
  onWatch,
  onMoreInfo,
  onSelectFeatured,
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#040e1b] pt-2 pb-6">
      {/* Background Image with Dark Vignette/Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={featuredItem.backdropUrl}
          alt={featuredItem.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transform transition-transform duration-1000"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e1b] via-[#040e1b]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040e1b] via-[#040e1b]/80 to-transparent w-full md:w-3/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-4">
        {/* #1 Trending Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#f5c518] text-slate-950 text-xs font-bold uppercase tracking-wider mb-4 shadow-md">
          <Flame className="w-3.5 h-3.5 fill-slate-950" />
          <span>#1 Trending Today</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase max-w-3xl leading-[0.95] drop-shadow-md">
          {featuredItem.title}
        </h1>

        {/* Metadata Line */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium my-4">
          <div className="flex items-center gap-1 text-[#f5c518]">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-white">
              {typeof featuredItem.rating === 'number'
                ? featuredItem.rating.toFixed(1)
                : featuredItem.rating}
            </span>
          </div>
          <span className="text-slate-500">•</span>
          <span>{featuredItem.year}</span>
          <span className="text-slate-500">•</span>
          <span>{featuredItem.genres[0]}</span>
          <span className="text-slate-500">•</span>
          <span className="px-1.5 py-0.5 rounded border border-[#f5c518]/80 text-[#f5c518] text-[10px] font-bold tracking-wider">
            {featuredItem.quality}
          </span>
        </div>

        {/* Synopsis */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed line-clamp-3 mb-8 drop-shadow">
          {featuredItem.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Watch Now Button */}
          <button
            id="hero-watch-btn"
            onClick={() => onWatch(featuredItem)}
            className="px-6 py-3 rounded-lg bg-[#f5c518] hover:bg-[#e0b000] active:scale-95 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-[#f5c518]/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Watch Now</span>
          </button>

          {/* More Info Button */}
          <button
            id="hero-info-btn"
            onClick={() => onMoreInfo(featuredItem)}
            className="px-5 py-3 rounded-lg bg-[#0b203a]/80 hover:bg-[#133257] active:scale-95 border border-white/10 text-white font-semibold text-sm sm:text-base flex items-center gap-2 backdrop-blur-sm transition-all cursor-pointer"
          >
            <Info className="w-4 h-4 text-slate-300" />
            <span>More Info</span>
          </button>

          {/* Heart Favorite Button */}
          <button
            id="hero-favorite-btn"
            onClick={(e) => onToggleFavorite(featuredItem.id, e)}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                : 'bg-[#0b203a]/80 border-white/10 text-slate-300 hover:text-white hover:bg-[#133257]'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* UP NEXT Strip (Screenshot 2) */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -rotate-90 hidden sm:block shrink-0">
              UP NEXT
            </span>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 w-full">
              {upNextItems.map((item) => {
                const isSelected = item.id === featuredItem.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectFeatured(item)}
                    className={`group flex items-center gap-3 p-1.5 rounded-lg border transition-all text-left shrink-0 cursor-pointer ${
                      isSelected
                        ? 'border-[#f5c518] bg-[#0b203a]'
                        : 'border-white/5 bg-[#07172b]/60 hover:border-white/20 hover:bg-[#0b203a]'
                    }`}
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div className="pr-2 max-w-[120px]">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-[#f5c518]">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.year} • {item.type}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
