import React, { useState } from 'react';
import { Star, Play, Heart, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface MovieCardProps {
  item: MediaItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWatch: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onWatch,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      id={`movie-card-${item.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col cursor-pointer transition-transform duration-200 select-none"
      onClick={() => onSelect(item)}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-lg group-hover:shadow-2xl group-hover:border-[#f5c518]/50 transition-all duration-300">
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
            <Film className="w-8 h-8 text-slate-700" />
          </div>
        )}

        {/* Poster Image */}
        {!imageError ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 text-center">
            <Film className="w-10 h-10 text-slate-600 mb-2" />
            <span className="text-xs font-semibold text-slate-400 line-clamp-2">{item.title}</span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#09182b]/90 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-100 shadow-md">
          <Star className="w-3 h-3 text-[#f5c518] fill-[#f5c518]" />
          <span>{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>
        </div>

        {/* Quality Badge (Top Left next to rating or Top Right on mobile) */}
        {item.quality && (
          <div className="absolute bottom-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/15 text-[10px] font-bold text-slate-300">
            {item.quality}
          </div>
        )}

        {/* Favorite Heart Button (Top-Right) */}
        <button
          id={`favorite-btn-${item.id}`}
          onClick={(e) => onToggleFavorite(item.id, e)}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-rose-600/90 text-white shadow-md'
              : 'bg-[#09182b]/80 backdrop-blur-sm text-slate-300 hover:text-white hover:bg-[#09182b]'
          } ${isHovered || isFavorite ? 'opacity-100 scale-100' : 'opacity-0 scale-90 md:opacity-0 md:group-hover:opacity-100 md:group-hover:scale-100'}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#040e1b] via-[#040e1b]/50 to-transparent flex flex-col items-center justify-between p-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full flex justify-end"></div>

          {/* Centered Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatch(item);
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:scale-110 hover:bg-[#f5c518] hover:text-slate-950 transition-all cursor-pointer shadow-lg"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>

          {/* Bottom Yellow Watch Now Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatch(item);
            }}
            className="w-full py-2 px-3 rounded-lg bg-[#f5c518] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#e0b000] active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Now</span>
          </button>
        </div>
      </div>

      {/* Media Details */}
      <div className="mt-2.5">
        <h3
          className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-[#f5c518] transition-colors"
          title={item.title}
        >
          {item.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
          <span>{item.year}</span>
          <span className="text-slate-600">•</span>
          <span>
            {item.type === 'series'
              ? 'Series'
              : item.type === 'documentary'
              ? 'Documentary'
              : 'Movie'}
          </span>
        </p>
      </div>
    </div>
  );
};
