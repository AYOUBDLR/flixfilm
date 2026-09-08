import React from 'react';
import { Play } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onLogoClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onLogoClick }) => {
  return (
    <footer className="w-full bg-[#030a14] border-t border-white/5 pt-14 pb-12 mt-16 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand & Tagline (Screenshot 7) */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={onLogoClick}
              className="flex items-center gap-2.5 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#f5c518] flex items-center justify-center text-slate-950">
                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
              </div>
              <span className="font-display text-2xl font-bold tracking-wider text-white">
                FLIXFILM
              </span>
            </button>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Stream movies and series in HD, free. New titles added every day.
            </p>
          </div>

          {/* BROWSE Column */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-slate-300 uppercase mb-4">
              BROWSE
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTab('trending')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trending
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('movies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Movies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('series')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  TV Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('favorites')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Favorites
                </button>
              </li>
            </ul>
          </div>

          {/* LEGAL Column */}
          <div>
            <h4 className="font-display text-xs font-bold tracking-widest text-slate-300 uppercase mb-4">
              LEGAL
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              FLIXFILM does not host any files on its servers. All media is linked from third-party services.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 FLIXFILM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
