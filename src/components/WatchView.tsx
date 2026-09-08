import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Heart,
  Share2,
  Download,
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import { MediaItem, Episode } from '../types';
import { MEDIA_DATA } from '../data/movies';

interface WatchViewProps {
  item: MediaItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
  onBrowse: () => void;
  onSelectMedia?: (media: MediaItem) => void;
}

export const WatchView: React.FC<WatchViewProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onBack,
  onBrowse,
  onSelectMedia,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(
    item.episodes && item.episodes.length > 0 ? item.episodes[0] : null
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on load or item change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPlaying(false);
    setCurrentEpisode(item.episodes && item.episodes.length > 0 ? item.episodes[0] : null);
  }, [item.id]);

  // Recommendations list for the sidebar matching Screenshot 2
  const sidebarRecommendations = useMemo(() => {
    // If Spider-Man is active, put Screenshot 2's specific titles first
    const preferredIds = [
      'story-of-the-vulture-conqueror',
      'sumotherhood',
      'justice-league',
      'o-incrivel-monstro-trapalhao',
      'the-sixth-gun',
      'tom-and-jerry-robin-hood',
    ];

    const specificItems = preferredIds
      .map((id) => MEDIA_DATA.find((m) => m.id === id))
      .filter((m): m is MediaItem => !!m && m.id !== item.id);

    const otherItems = MEDIA_DATA.filter(
      (m) => m.id !== item.id && !preferredIds.includes(m.id)
    );

    return [...specificItems, ...otherItems].slice(0, 8);
  }, [item.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerContainerRef.current.requestFullscreen();
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDownload = () => {
    setDownloadToast(`Starting secure high-speed download for "${item.title}" (${item.quality})...`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#040e1b] text-slate-100 pb-24 selection:bg-[#f5c518] selection:text-slate-950">
      {/* Top Navigation Bar matching Screenshot 1 */}
      <header className="sticky top-0 z-50 bg-[#040e1b]/95 backdrop-blur-md border-b border-white/5 py-3 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={onBrowse}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-[#f5c518] flex items-center justify-center text-slate-950 group-hover:scale-105 transition-transform">
              <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white">
              FLIXFILM
            </span>
          </button>
        </div>

        <button
          onClick={onBrowse}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#09182b] hover:bg-[#132c4d] border border-white/10 text-xs sm:text-sm font-medium text-slate-200 transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-300" />
          <span>Browse</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Video Player Section matching Screenshot 1 */}
        <div
          ref={playerContainerRef}
          className="group relative w-full aspect-[16/9] md:aspect-[2.05/1] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl"
        >
          <video
            ref={videoRef}
            src={item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            poster={item.backdropUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
            playsInline
          />

          {/* Backdrop fallback / poster preview when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 cursor-pointer overflow-hidden flex items-center justify-center"
            >
              <img
                src={item.backdropUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none transform transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/25 transition-colors hover:bg-black/15" />

              {/* Center Circular Play Button matching Screenshot 1 */}
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7a1c28]/85 hover:bg-[#991c2e] border border-white/40 backdrop-blur-sm flex items-center justify-center text-white shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:scale-110 active:scale-95 transition-all">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Player Controls Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 z-20 ${
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            {/* Timeline Slider */}
            <div className="flex items-center gap-3 mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-700/80 accent-[#f5c518] rounded-lg cursor-pointer transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <span>
                  {formatTime(currentTime)} / {formatTime(duration || 145 * 60)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded bg-[#f5c518]/20 border border-[#f5c518] text-[#f5c518] font-bold text-[10px]">
                  {item.quality}
                </span>
                <button
                  onClick={handleFullscreen}
                  className="p-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Now & Download Action Buttons matching Screenshot 2 */}
        <div className="flex items-center justify-center sm:justify-start gap-4 mt-6">
          <button
            onClick={togglePlay}
            className="px-12 sm:px-14 py-3 rounded-lg bg-[#f5c518] hover:bg-[#e0b000] text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(245,197,24,0.35)] transition-all cursor-pointer active:scale-95 text-center min-w-[170px]"
          >
            {isPlaying ? 'Playing Now' : 'Watch Now'}
          </button>

          <button
            onClick={handleDownload}
            className="px-12 sm:px-14 py-3 rounded-lg bg-[#0b203a] hover:bg-[#133257] border border-white/10 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer active:scale-95 text-center min-w-[170px]"
          >
            Download
          </button>
        </div>

        {/* Download Toast notification */}
        {downloadToast && (
          <div className="mt-4 p-3 rounded-lg bg-[#0b203a] border border-[#f5c518]/40 text-xs text-[#f5c518] flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Two-Column Details & Sidebar Layout matching Screenshot 2 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Main Details Left Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              {/* Poster Image */}
              <div className="w-44 sm:w-56 shrink-0 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title, Badges, Synopsis & Buttons */}
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-none">
                  {item.title}
                </h1>

                {/* Badges line: 4K, Star rating, Duration */}
                <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                  <span className="px-1.5 py-0.5 rounded bg-[#f5c518] text-slate-950 font-bold text-xs">
                    {item.quality}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#f5c518]">★</span>
                    <span>{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>
                  </div>
                  <span>{item.duration || '2h 25m'}</span>
                </div>

                {/* Synopsis */}
                <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {item.overview}
                </p>

                {/* Action Buttons: List & Share */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={(e) => onToggleFavorite(item.id, e)}
                    className={`px-5 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'bg-[#0b203a] border-white/10 text-slate-200 hover:text-white hover:bg-[#133257]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                    <span>{isFavorite ? 'In List' : 'List'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-5 py-2.5 rounded-lg bg-[#0b203a] hover:bg-[#133257] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Metadata Table Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      RELEASE
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      {item.releaseDate || '2026-07-29'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      STATUS
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      {item.status || 'Released'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      LANGUAGE
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      {item.language || 'EN'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      GENRE
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      {item.genres && item.genres.length > 0 ? item.genres.join(', ') : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TV Series Episodes Section (if TV Series) */}
            {item.type === 'series' && item.episodes && item.episodes.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white mb-4">
                  EPISODES
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {item.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => {
                        setCurrentEpisode(ep);
                        togglePlay();
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        currentEpisode?.id === ep.id
                          ? 'bg-[#0b203a] border-[#f5c518]'
                          : 'bg-[#071629]/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img
                          src={ep.thumbnail}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white/80" />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[#f5c518]">Episode {ep.episodeNumber}</p>
                      <p className="text-sm font-semibold text-white truncate">{ep.title}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ep.overview}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Recommendations Sidebar matching Screenshot 2 */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-3.5">
            {sidebarRecommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectMedia?.(rec)}
                className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-[#0b203a]/70 cursor-pointer transition-colors group"
              >
                {/* Poster Thumbnail */}
                <div className="w-14 h-20 shrink-0 rounded-md overflow-hidden bg-slate-800 border border-white/10 shadow-sm">
                  <img
                    src={rec.posterUrl}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#f5c518] transition-colors line-clamp-2 leading-snug">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span className="text-[#f5c518]">★</span>
                    <span>{typeof rec.rating === 'number' ? rec.rating.toFixed(1) : rec.rating}</span>
                    <span className="text-slate-600">•</span>
                    <span>{rec.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>

        {/* Disclaimer Legal Notice matching footer */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-slate-500 space-y-2">
          <p>
            FLIXFILM does not host any files on its servers. All media is linked from third-party services.
          </p>
          <p>© 2026 FLIXFILM. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};
