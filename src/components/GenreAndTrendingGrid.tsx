import React from 'react';
import { MediaItem } from '../types';
import { GENRES } from '../data/movies';
import { MovieCard } from './MovieCard';

interface GenreAndTrendingGridProps {
  items: MediaItem[];
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
  trendingFilter: 'Trending' | 'Movies' | 'Series' | 'Top Rated' | 'Favorites';
  onSelectTrendingFilter: (filter: 'Trending' | 'Movies' | 'Series' | 'Top Rated' | 'Favorites') => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWatch: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
}

export const GenreAndTrendingGrid: React.FC<GenreAndTrendingGridProps> = ({
  items,
  selectedGenre,
  onSelectGenre,
  trendingFilter,
  onSelectTrendingFilter,
  favorites,
  onToggleFavorite,
  onWatch,
  onSelect,
}) => {
  return (
    <div className="mt-8 mb-14">
      {/* Browse By Genre Section (Screenshot 5) */}
      <div className="mb-12">
        <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
          BROWSE BY GENRE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 mb-4">
          Pick a mood, we'll do the rest
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          <button
            onClick={() => onSelectGenre(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              selectedGenre === null
                ? 'bg-[#f5c518] text-slate-950 border-[#f5c518]'
                : 'bg-[#0b203a]/70 text-slate-300 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            All Genres
          </button>
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => onSelectGenre(isSelected ? null : genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#f5c518] text-slate-950 border-[#f5c518]'
                    : 'bg-[#0b203a]/70 text-slate-300 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending This Week Grid Section (Screenshot 5 & 6) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
              TRENDING THIS WEEK
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              What everyone is watching right now
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#071629] border border-white/10 overflow-x-auto no-scrollbar">
            {(['Trending', 'Movies', 'Series', 'Top Rated', 'Favorites'] as const).map((filter) => {
              const isActive = trendingFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => onSelectTrendingFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#f5c518] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Grid */}
        {items.length === 0 ? (
          <div className="py-16 text-center bg-[#071629]/50 rounded-2xl border border-white/5">
            <p className="text-slate-300 font-medium">No titles found in this category.</p>
            <p className="text-slate-500 text-xs mt-1">Try selecting a different filter or genre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {items.map((item) => (
              <MovieCard
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                onWatch={onWatch}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
