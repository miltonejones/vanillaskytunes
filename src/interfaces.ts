export interface IState {
  ready: boolean;
  podcasts: IPodcast[];
  subscriptions: IPodcast[];
  view: string;
  results: IPodcast[];
  currentPodcast?: IPodcast;
  page?: number;
  episodes?: ParsedEpisode[];
  totalEpisodes?: number;
  currentEpisodesPage?: number;
  currentTrackGuid?: string;
  expandedNodes: any;
  currentTrack?: ITrack | null;
  trackList?: ParsedEpisode[] | null;
  volume?: number;
  currentTime: number;
  duration: number;
  isPlaying?: boolean;
  detail?: any;
  loading: boolean;
  error?: string | null;
  title?: string;
}

export interface ITrackMemory {
  progress: number;
  guid: string;
}

export interface IProgress {
  guid: string;
  progress: number;
}

// const track = {
//   title: episode.title,
//   audioUrl: episode.enclosure.url,
//   guid: episode.guid,
//   description: episode.description,
//   duration: episode.duration,
//   episode: episode,
// };
export interface IStore {
  state: IState;
  listeners: any[];
  COOKIE_NAME: string;
}

// You can also add other interfaces you might need
export interface IPodcast {
  wrapperType?: string;
  kind?: string;
  artistId?: number;
  collectionId?: number;
  trackId?: number;
  artistName?: string;
  collectionName?: string;
  trackName?: string;
  collectionCensoredName?: string;
  trackCensoredName?: string;
  artistViewUrl?: string;
  collectionViewUrl?: string;
  feedUrl?: string;
  trackViewUrl?: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  collectionPrice?: number;
  trackPrice?: number;
  collectionHdPrice?: number;
  releaseDate?: string;
  collectionExplicitness?: string;
  trackExplicitness?: string;
  trackCount?: number;
  trackTimeMillis?: number;
  country?: string;
  currency?: string;
  primaryGenreName?: string;
  contentAdvisoryRating?: string;
  artworkUrl600?: string;
  genreIds?: string[];
  genres?: string[];
}

export interface IPodcastResponse {
  resultCount: number;
  results: IPodcast[];
}

export interface ParsedEpisode {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  guid: string;
  enclosure: Enclosure | null;
  duration: string;
  author: string;
}

export interface IEpisode {
  id: string;
  title: string;
  description?: string;
  publishDate: string;
  audioUrl: string;
  duration?: number;
}

export interface ISearchResult {
  podcasts: IPodcast[];
  totalCount: number;
}

export interface Enclosure {
  url: string;
  type: string;
  length: string;
}

export interface PaginationResult {
  visible: ParsedEpisode[];
  pageCount: number;
  startNum: number;
}

export interface ITrack {
  title: string;
  audioUrl: string;
  guid: string;
  description: string;
  duration: string;
  episode: ParsedEpisode;
}
