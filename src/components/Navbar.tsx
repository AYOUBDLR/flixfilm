import React from 'react';
import { Search, Play, Heart } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  onLogoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  favoritesCount,
  onLogoClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#051326]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            id="brand-logo-btn"
            onClick={onLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#f5c518] flex items-center justify-center text-slate-950 shadow-sm transition-transform group-hover:scale-105">
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wider text-white">
              FLIXFILM
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-trending-btn"
              onClick={() => onSelectTab('trending')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'trending' && !searchQuery
                  ? 'text-[#f5c518]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Trending
            </button>
            <button
              id="nav-movies-btn"
              onClick={() => onSelectTab('movies')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'movies' && !searchQuery
                  ? 'text-[#f5c518]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button
              id="nav-series-btn"
              onClick={() => onSelectTab('series')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'series' && !searchQuery
                  ? 'text-[#f5c518]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              TV Series
            </button>
            <button
              id="nav-favorites-btn"
              onClick={() => onSelectTab('favorites')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'favorites' && !searchQuery
                  ? 'text-[#f5c518]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 text-xs font-bold rounded-full bg-[#f5c518] text-slate-950">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-md justify-end">
          <div className="relative w-full max-w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-media-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, series..."
              className="w-full bg-[#0b203a]/80 border border-slate-700/60 focus:border-[#f5c518] rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
