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
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { MediaItem, Episode } from '../types';
import { MEDIA_DATA } from '../data/movies';
import { ContentLockerModal } from './ContentLockerModal';

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
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [episodeToast, setEpisodeToast] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(
    item.episodes && item.episodes.length > 0 ? item.episodes[0] : null
  );
  const [selectedSeason, setSelectedSeason] = useState<number>(
    item.episodes && item.episodes.length > 0 ? item.episodes[0].season || 1 : 1
  );

  const [showLockerModal, setShowLockerModal] = useState(false);
  const [hasTriggeredLocker, setHasTriggeredLocker] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Resume playback when continuing from locker popup
  const handleContinueWatching = () => {
    setShowLockerModal(false);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Handle selecting an episode: starts playing directly
  const handleSelectEpisode = (ep: Episode) => {
    setCurrentEpisode(ep);
    setCurrentTime(0);
    setHasTriggeredLocker(false);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setEpisodeToast(
      `Now Playing: Season ${ep.season || selectedSeason} • Episode ${ep.episodeNumber} - ${ep.title}`
    );
    setTimeout(() => {
      setEpisodeToast(null);
    }, 4000);
  };

  // Parse exact duration string like "55 min", "55m", "1h 45m", "1h 47m", "2h 25m" to real seconds
  const parseDurationToSeconds = (durationStr?: string): number => {
    if (!durationStr) return 3300; // default 55 min (3300s)
    const str = durationStr.toLowerCase().trim();

    // If string describes series seasons (e.g. "8 Seasons"), default episode duration is 55 min
    if (str.includes('season')) {
      return 3300; // 55 min (3300s)
    }

    const hoursMatch = str.match(/(\d+)\s*h/);
    const minsMatch = str.match(/(\d+)\s*(?:m|min)/);
    const secsMatch = str.match(/(\d+)\s*s/);

    let total = 0;
    if (hoursMatch) total += parseInt(hoursMatch[1], 10) * 3600;
    if (minsMatch) total += parseInt(minsMatch[1], 10) * 60;
    if (secsMatch) total += parseInt(secsMatch[1], 10);

    if (total > 0) return total;

    // Handle "1:45:00" or "55:00"
    if (str.includes(':')) {
      const parts = str.split(':').map((p) => parseInt(p, 10));
      if (parts.length === 3) {
        return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
      } else if (parts.length === 2) {
        return (parts[0] || 0) * 60 + (parts[1] || 0);
      }
    }

    const num = parseInt(str, 10);
    if (!isNaN(num)) {
      return num * 60;
    }

    return 3300;
  };

  // Determine active duration string and total duration in seconds for current movie/episode
  const activeDurationStr = useMemo(() => {
    if (item.type === 'series') {
      if (currentEpisode?.duration) {
        return currentEpisode.duration;
      }
      return '55 min';
    }
    return item.duration || '1h 45m';
  }, [item.type, item.duration, currentEpisode?.duration]);

  const totalDuration = useMemo(() => {
    return parseDurationToSeconds(activeDurationStr);
  }, [activeDurationStr]);

  // Format time properly (e.g. "0:00 / 1:45:00" or "0:00 / 1:47:00" or "0:00 / 55:00")
  const formatTimeDisplay = (currentSec: number, totalSec: number) => {
    const formatPart = (s: number, forceHours: boolean) => {
      if (isNaN(s) || s < 0) s = 0;
      const total = Math.floor(s);
      const hrs = Math.floor(total / 3600);
      const mins = Math.floor((total % 3600) / 60);
      const secs = total % 60;

      if (forceHours || hrs > 0) {
        if (hrs > 0) {
          return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const hasHours = totalSec >= 3600;
    const currentFormatted = formatPart(currentSec, false);
    const totalFormatted = formatPart(totalSec, hasHours);

    return `${currentFormatted} / ${totalFormatted}`;
  };

  // Scroll to top and reset timer on load or item change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPlaying(false);
    setCurrentTime(0);
    setHasTriggeredLocker(false);
    setShowLockerModal(false);
    const firstEp = item.episodes && item.episodes.length > 0 ? item.episodes[0] : null;
    setCurrentEpisode(firstEp);
    setSelectedSeason(firstEp?.season || 1);
  }, [item.id]);

  // Compute available seasons and episodes for selected season
  const availableSeasons = useMemo(() => {
    if (!item.episodes || item.episodes.length === 0) return [1];
    const seasons = Array.from(
      new Set(item.episodes.map((e) => Number(e.season || 1)))
    ).sort((a: number, b: number) => a - b);
    return seasons.length > 0 ? seasons : [1];
  }, [item.episodes]);

  const seasonEpisodes = useMemo(() => {
    if (!item.episodes) return [];
    const filtered = item.episodes.filter((e) => (e.season || 1) === selectedSeason);
    return filtered.length > 0 ? filtered : item.episodes;
  }, [item.episodes, selectedSeason]);

  // Real-time playback timer advancement across actual duration
  // Automatically pops up locker after video runs for 3 seconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= 3 && !hasTriggeredLocker) {
            setHasTriggeredLocker(true);
            setIsPlaying(false);
            if (videoRef.current) videoRef.current.pause();
            setShowLockerModal(true);
            return next;
          }
          if (next >= totalDuration) {
            setIsPlaying(false);
            if (videoRef.current) videoRef.current.pause();
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration, hasTriggeredLocker]);

  // Recommendations list for the sidebar matching Screenshot 2 & user request
  const sidebarRecommendations = useMemo(() => {
    if (item.id === 'love-island-usa' || item.genres?.includes('Romance')) {
      const elPoder = MEDIA_DATA.find((m) => m.id === 'el-poder-del-amor');
      const others = MEDIA_DATA.filter((m) => m.id !== item.id && m.id !== 'el-poder-del-amor');
      return elPoder ? [elPoder, ...others].slice(0, 8) : others.slice(0, 8);
    }

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
  }, [item.id, item.genres]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = time % videoRef.current.duration;
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
        {/* Video Player Section matching Screenshot */}
        <div
          ref={playerContainerRef}
          className="group relative w-full aspect-[16/9] md:aspect-[2.05/1] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl"
        >
          <video
            ref={videoRef}
            src={item.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
            poster={currentEpisode?.thumbnail || item.backdropUrl}
            loop
            playsInline
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (isPlaying && v.currentTime >= 3 && !hasTriggeredLocker) {
                setHasTriggeredLocker(true);
                setIsPlaying(false);
                v.pause();
                setShowLockerModal(true);
              }
            }}
            className="w-full h-full object-cover"
          />

          {/* Episode Indicator Toast Overlay on top of player */}
          {episodeToast && (
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2.5 bg-black/85 backdrop-blur-md border border-[#f5c518]/60 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-2xl animate-fade-in pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f5c518] animate-ping" />
              <span className="text-[#f5c518] font-bold">Now Playing:</span>
              <span className="text-slate-100">
                {currentEpisode?.title || `Episode ${currentEpisode?.episodeNumber}`}
              </span>
            </div>
          )}

          {/* Backdrop fallback / poster preview when paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 cursor-pointer overflow-hidden flex items-center justify-center"
            >
              <img
                src={currentEpisode?.thumbnail || item.backdropUrl}
                alt={currentEpisode?.title || item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none transform transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/25 transition-colors hover:bg-black/15" />
            </div>
          )}

          {/* Player Controls Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 z-20 ${
              isPlaying ? 'opacity-90 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            {/* Timeline Slider with bright yellow circular scrubber thumb matching screenshot */}
            <div className="relative flex items-center w-full mb-2.5 group/timeline cursor-pointer py-1">
              <div className="relative w-full h-1 bg-white/25 rounded-full overflow-visible">
                {/* Yellow Progress Fill */}
                <div
                  className="absolute top-0 left-0 h-full bg-[#f5c518] rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(0, (currentTime / (totalDuration || 1)) * 100))}%`,
                  }}
                />
                {/* Yellow Circular Scrubber Dot matching screenshot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#f5c518] rounded-full shadow-[0_0_8px_rgba(245,197,24,0.8)] -translate-x-1/2 pointer-events-none transition-transform group-hover/timeline:scale-125"
                  style={{
                    left: `${Math.min(100, Math.max(0, (currentTime / (totalDuration || 1)) * 100))}%`,
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="1"
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={togglePlay}
                  className="p-1 hover:text-white transition-colors cursor-pointer text-white"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 hover:text-white transition-colors cursor-pointer text-white"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>

                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-200 tracking-wider">
                  {formatTimeDisplay(currentTime, totalDuration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFullscreen}
                  className="p-1 hover:text-white transition-colors cursor-pointer text-white"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Now & Download Action Buttons matching Screenshot */}
        <div className="flex items-center justify-start gap-4 mt-6">
          <button
            onClick={togglePlay}
            className="px-10 sm:px-12 py-3 rounded-lg bg-[#f5c518] hover:bg-[#e0b000] text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(245,197,24,0.35)] transition-all cursor-pointer active:scale-95 text-center min-w-[160px]"
          >
            {isPlaying ? 'Pause' : 'Watch Now'}
          </button>

          <button
            onClick={handleDownload}
            className="px-10 sm:px-12 py-3 rounded-lg bg-[#0c223d] hover:bg-[#133257] border border-slate-700/60 text-white font-medium text-sm sm:text-base transition-all cursor-pointer active:scale-95 text-center min-w-[160px]"
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
                      {item.releaseTime && (
                        <span className="text-[#f5c518] font-medium"> • {item.releaseTime}</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      RUNTIME
                    </p>
                    <p className="text-sm font-semibold text-white mt-1">
                      {activeDurationStr}
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

            {/* TV Series Episodes Section matching User Screenshot */}
            {item.type === 'series' && item.episodes && item.episodes.length > 0 && (
              <div className="mt-10 pt-6 border-t border-white/10">
                {/* Episodes Header matching screenshot */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                      EPISODES
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      {seasonEpisodes.length} episodes available
                    </p>
                  </div>

                  {/* Season Dropdown Selector matching screenshot */}
                  {availableSeasons.length > 0 && (
                    <div className="relative">
                      <select
                        value={selectedSeason}
                        onChange={(e) => {
                          const newSeason = Number(e.target.value);
                          setSelectedSeason(newSeason);
                          const firstOfSeason = item.episodes?.find((ep) => (ep.season || 1) === newSeason);
                          if (firstOfSeason) {
                            setCurrentEpisode(firstOfSeason);
                            setCurrentTime(0);
                          }
                        }}
                        className="appearance-none bg-[#0a1e38] hover:bg-[#0e2749] text-white font-medium text-xs sm:text-sm pl-4 pr-9 py-2 rounded-xl border border-slate-700/60 cursor-pointer transition-colors shadow-sm focus:outline-none focus:ring-1 focus:ring-[#f5c518]"
                      >
                        {availableSeasons.map((s) => (
                          <option key={s} value={s} className="bg-[#0a1e38] text-white">
                            Season {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* Episodes List matching screenshot */}
                <div className="max-h-[580px] overflow-y-auto space-y-2.5 pr-2 scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent">
                  {seasonEpisodes.map((ep) => {
                    const isSelected = currentEpisode?.id === ep.id;
                    return (
                      <div
                        key={ep.id}
                        onClick={() => handleSelectEpisode(ep)}
                        className={`flex items-center justify-between gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-[#0b2447] border border-[#f5c518]/50 shadow-md'
                            : 'hover:bg-[#091f3a] border border-transparent'
                        }`}
                      >
                        {/* Left: Number Badge + Thumbnail + Details */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          {/* Episode Number Box */}
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#f5c518] text-slate-950 font-black'
                                : 'bg-[#081f3c] border border-white/5 text-slate-300 group-hover:text-white'
                            }`}
                          >
                            {ep.episodeNumber}
                          </div>

                          {/* 16:9 Episode Thumbnail */}
                          <div className="relative w-24 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-white/5">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Subtle play hover overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>

                          {/* Title & Release Date */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm sm:text-base font-bold truncate transition-colors ${
                                isSelected ? 'text-[#f5c518]' : 'text-white group-hover:text-[#f5c518]'
                              }`}
                            >
                              {ep.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <span>{ep.releaseDate || '2019-07-09'}</span>
                              {ep.duration && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono">{ep.duration}</span>
                                </>
                              )}
                              {ep.releaseTime && (
                                <>
                                  <span>•</span>
                                  <span className="text-[#f5c518]/90 font-mono">{ep.releaseTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Play Icon matching screenshot */}
                        <div className="shrink-0 px-2 sm:px-4">
                          <Play
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                              isSelected
                                ? 'text-[#f5c518] fill-[#f5c518] scale-110'
                                : 'text-slate-400 group-hover:text-white fill-slate-400 group-hover:fill-white'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Recommendations Sidebar matching Screenshot */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              MORE LIKE THIS
            </h3>
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

      {/* Content Locker Verification matching exact dashboard design */}
      <ContentLockerModal
        isOpen={showLockerModal}
        targetUrl="https://saveapp.space/cl/i/l7v3wd"
        onUnlocked={() => {
          setShowLockerModal(false);
          setIsPlaying(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
      />
    </div>
  );
};
