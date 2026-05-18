export interface Guest {
  id: string;
  name: string;
  bio: string;
  twitterHandle?: string;
  instagramHandle?: string;
}

export interface InsideJoke {
  id: string;
  episodeId: string;
  startTimeStamp: string;
  endTimeStamp: string;
  keyConcept: string;
  transcriptContext: string;
}

export interface EpisodeImage {
  id: string;
  url: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  platformType: 'YOUTUBE' | 'SPOTIFY' | 'OTHER';
  contentUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  isExclusive: boolean;
  durationSeconds?: number;
  guests?: Guest[];
  insideJokes?: InsideJoke[];
  images?: EpisodeImage[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EpisodesResponse {
  data: Episode[];
  meta: Pagination;
}

export interface EpisodesGridProps {
  mode: 'preview' | 'full';
  apiBaseUrl?: string;
}