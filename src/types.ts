export type MediaType = 'movie' | 'series' | 'documentary';

export interface Episode {
  id: string;
  season: number;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  overview: string;
  releaseDate?: string;
  releaseTime?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  year: number;
  rating: number | string;
  duration?: string;
  quality: '4K' | 'HD';
  genres: string[];
  status: 'Released' | 'Ongoing' | 'Completed';
  language: string;
  releaseDate: string;
  releaseTime?: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl?: string;
  isTrendingToday?: boolean;
  top10Rank?: number;
  seasonsCount?: number;
  episodes?: Episode[];
}

export type ActiveTab = 'trending' | 'movies' | 'series' | 'favorites';
