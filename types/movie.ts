export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
  img?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface TVDetails {
  number_of_seasons: number;
  episode_run_time: number[];
  seasons: Season[];
}

export interface Season {
  season_number: number;
  episode_count: number;
  name?: string;
  overview?: string;
  poster_path?: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path?: string;
  runtime?: number;
  air_date?: string;
  vote_average?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
  known_for_department?: string;
}

export interface SavedShow {
  id: number;
  title: string;
  img: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type?: 'movie' | 'tv';
}

export interface Genre {
  id: number;
  name: string;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}
