import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, MediaItem } from './types';
import { MEDIA_DATA } from './data/movies';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MediaCarousel } from './components/MediaCarousel';
import { MovieCard } from './components/MovieCard';
import { GenreAndTrendingGrid } from './components/GenreAndTrendingGrid';
import { WatchView } from './components/WatchView';
import { MoreInfoModal } from './components/MoreInfoModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [trendingFilter, setTrendingFilter] = useState<'Trending' | 'Movies' | 'Series' | 'Top Rated' | 'Favorites'>('Trending');
  
  // Featured hero item
  const [featuredItem, setFeaturedItem] = useState<MediaItem>(
    MEDIA_DATA.find((m) => m.isTrendingToday) || MEDIA_DATA[0]
  );
  
  // Active Watch view (Screenshots 8, 9, 10)
  const [watchingMedia, setWatchingMedia] = useState<MediaItem | null>(null);

  // More Info Modal
  const [infoModalItem, setInfoModalItem] = useState<MediaItem | null>(null);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flixfilm_favorites') || localStorage.getItem('fypflix_favorites');
      return saved ? JSON.parse(saved) : ['the-runner', 'spider-man-brand-new-day'];
    } catch {
      return ['the-runner', 'spider-man-brand-new-day'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('flixfilm_favorites', JSON.stringify(favorites));
    } catch {
      // storage unavailable
    }
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleWatch = (item: MediaItem) => {
    setWatchingMedia(item);
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedGenre(null);
    if (tab === 'movies') setTrendingFilter('Movies');
    else if (tab === 'series') setTrendingFilter('Series');
    else if (tab === 'favorites') setTrendingFilter('Favorites');
    else setTrendingFilter('Trending');
  };

  // Top 10 items
  const top10Items = useMemo(() => {
    return MEDIA_DATA.filter((m) => m.top10Rank).sort(
      (a, b) => (a.top10Rank || 99) - (b.top10Rank || 99)
    );
  }, []);

  // Popular movies
  const popularMovies = useMemo(() => {
    return MEDIA_DATA.filter((m) => m.type === 'movie');
  }, []);

  // Binge worthy series
  const bingeSeries = useMemo(() => {
    return MEDIA_DATA.filter((m) => m.type === 'series');
  }, []);

  // Up Next items for Hero strip (Screenshot 2)
  const upNextItems = useMemo(() => {
    return MEDIA_DATA.filter((m) => m.id !== featuredItem.id).slice(0, 6);
  }, [featuredItem]);

  // Filtered grid items
  const filteredGridItems = useMemo(() => {
    let result = [...MEDIA_DATA];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.overview.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (selectedGenre) {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }

    // Trending/Sub-tab filter
    if (trendingFilter === 'Movies') {
      result = result.filter((m) => m.type === 'movie');
    } else if (trendingFilter === 'Series') {
      result = result.filter((m) => m.type === 'series');
    } else if (trendingFilter === 'Top Rated') {
      result = result.filter((m) => typeof m.rating === 'number' && m.rating >= 8.0);
    } else if (trendingFilter === 'Favorites') {
      result = result.filter((m) => favorites.includes(m.id));
    }

    return result;
  }, [searchQuery, selectedGenre, trendingFilter, favorites]);

  // If in Watch Mode (Screenshots 8, 9, 10), render WatchView
  if (watchingMedia) {
    return (
      <WatchView
        item={watchingMedia}
        isFavorite={favorites.includes(watchingMedia.id)}
        onToggleFavorite={toggleFavorite}
        onBack={() => setWatchingMedia(null)}
        onBrowse={() => setWatchingMedia(null)}
        onSelectMedia={(m) => setWatchingMedia(m)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#040e1b] text-slate-100 flex flex-col selection:bg-[#f5c518] selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        onLogoClick={() => {
          setActiveTab('trending');
          setSearchQuery('');
          setSelectedGenre(null);
          setTrendingFilter('Trending');
          setWatchingMedia(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If user is searching, show dedicated search results grid */}
        {searchQuery.trim() ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-display text-2xl font-bold uppercase text-white mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Found {filteredGridItems.length} titles
            </p>
            {filteredGridItems.length === 0 ? (
              <div className="py-20 text-center bg-[#071629]/60 rounded-2xl border border-white/5">
                <p className="text-slate-300 font-medium">No results found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#f5c518] text-slate-950 text-xs font-bold"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {filteredGridItems.map((item) => (
                  <div key={item.id}>
                    <MovieCard
                      item={item}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={toggleFavorite}
                      onWatch={handleWatch}
                      onSelect={handleWatch}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Section with UP NEXT Row (Screenshot 1 & 2) */}
            {activeTab === 'trending' && (
              <HeroBanner
                featuredItem={featuredItem}
                upNextItems={upNextItems}
                isFavorite={favorites.includes(featuredItem.id)}
                onToggleFavorite={toggleFavorite}
                onWatch={handleWatch}
                onMoreInfo={handleWatch}
                onSelectFeatured={(m) => setFeaturedItem(m)}
              />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              {/* TOP 10 THIS WEEK Section (Screenshot 2) */}
              {(activeTab === 'trending' || activeTab === 'movies' || activeTab === 'series') && (
                <MediaCarousel
                  title="TOP 10 THIS WEEK"
                  subtitle="Ranked by what everyone is streaming"
                  items={top10Items}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onWatch={handleWatch}
                  onSelect={handleWatch}
                />
              )}

              {/* POPULAR MOVIES Section (Screenshot 3) */}
              {(activeTab === 'trending' || activeTab === 'movies') && (
                <MediaCarousel
                  title="POPULAR MOVIES"
                  subtitle="Big titles, watching now"
                  items={popularMovies}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onWatch={handleWatch}
                  onSelect={handleWatch}
                />
              )}

              {/* BINGE-WORTHY SERIES Section (Screenshot 4) */}
              {(activeTab === 'trending' || activeTab === 'series') && (
                <MediaCarousel
                  title="BINGE-WORTHY SERIES"
                  subtitle="Full seasons, ready to play"
                  items={bingeSeries}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onWatch={handleWatch}
                  onSelect={handleWatch}
                />
              )}

              {/* BROWSE BY GENRE & TRENDING THIS WEEK Section (Screenshot 5 & 6) */}
              <GenreAndTrendingGrid
                items={filteredGridItems}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                trendingFilter={trendingFilter}
                onSelectTrendingFilter={setTrendingFilter}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onWatch={handleWatch}
                onSelect={handleWatch}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer (Screenshot 7) */}
      <Footer
        onSelectTab={handleSelectTab}
        onLogoClick={() => {
          setActiveTab('trending');
          setSearchQuery('');
          setSelectedGenre(null);
          setTrendingFilter('Trending');
          setWatchingMedia(null);
        }}
      />

      {/* Quick More Info Modal */}
      <MoreInfoModal
        item={infoModalItem}
        isOpen={!!infoModalItem}
        onClose={() => setInfoModalItem(null)}
        isFavorite={infoModalItem ? favorites.includes(infoModalItem.id) : false}
        onToggleFavorite={toggleFavorite}
        onWatch={handleWatch}
      />
    </div>
  );
}
