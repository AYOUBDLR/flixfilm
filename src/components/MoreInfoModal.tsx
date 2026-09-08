import React from 'react';
import { X, Play, Heart, Star, Calendar, Clock, Film } from 'lucide-react';
import { MediaItem } from '../types';

interface MoreInfoModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onWatch: (item: MediaItem) => void;
}

export const MoreInfoModal: React.FC<MoreInfoModalProps> = ({
  item,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onWatch,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#071629] border border-white/10 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Backdrop in Modal */}
        <div className="relative aspect-video w-full shrink-0 bg-slate-900">
          <img
            src={item.backdropUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071629] via-[#071629]/50 to-transparent" />

          {/* Quick Play & Favorite in backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
                {item.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-[#f5c518] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}
                </span>
                <span>•</span>
                <span>{item.year}</span>
                <span>•</span>
                <span className="px-1.5 py-0.5 rounded border border-[#f5c518] text-[#f5c518] text-[10px] font-bold">
                  {item.quality}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onWatch(item);
                }}
                className="px-5 py-2 rounded-lg bg-[#f5c518] hover:bg-[#e0b000] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Watch</span>
              </button>

              <button
                onClick={(e) => onToggleFavorite(item.id, e)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-[#0b203a] border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed">{item.overview}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0b203a]/60 border border-white/5 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Type</span>
              <span className="font-semibold text-white capitalize">{item.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Duration</span>
              <span className="font-semibold text-white">{item.duration || '2h 10m'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Language</span>
              <span className="font-semibold text-white">{item.language}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Status</span>
              <span className="font-semibold text-white">{item.status}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Genres
            </span>
            <div className="flex flex-wrap gap-2">
              {item.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0b203a] text-slate-200 border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
