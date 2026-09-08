import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';
import { MovieCard } from './MovieCard';

interface MediaCarouselProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWatch: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  subtitle,
  items,
  favorites,
  onToggleFavorite,
  onWatch,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 600;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-[#0b203a]/90 hover:bg-[#133257] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-[#0b203a]/90 hover:bg-[#133257] text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-3"
      >
        {items.map((item) => (
          <div key={item.id} className="w-38 sm:w-46 md:w-52 shrink-0">
            <MovieCard
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={onToggleFavorite}
              onWatch={onWatch}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
