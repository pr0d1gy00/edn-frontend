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
