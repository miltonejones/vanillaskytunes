// store.ts
import { RSSParser } from "./controllers/rssParser";
import { ToastController } from "./controllers/toastController";
import type {
  IState,
  IStore,
  IPodcastResponse,
  IPodcast,
  ParsedEpisode,
  ITrack,
  ITrackMemory,
} from "./interfaces";
import { getPodcast, getPodcasts, shuffleArray } from "./util";

type Listener = (state: IState) => void;

export class PodcastStore implements IStore {
  state: IState;
  listeners: Listener[];
  COOKIE_NAME: string;
  expandedNodes: any;
  audioElement: HTMLAudioElement;
  audioAttached: boolean = false;
  parser: RSSParser;
  toast: ToastController;

  constructor() {
    this.state = {
      ready: false,
      podcasts: [],
      subscriptions: [],
      view: "home",
      results: [],
      expandedNodes: {},
      currentTime: 0,
      duration: 0,
      loading: false,
    };
    this.listeners = [];
    this.COOKIE_NAME = "rss-subs";
    this.audioElement = new Audio();
    this.parser = new RSSParser();
    this.toast = new ToastController();
  }

  async initializeApp() {
    this.loadSubscriptions();
    const res: IPodcastResponse = await getPodcasts("popular");
    this.setState({
      podcasts: shuffleArray(res.results),
      ready: true,
    });
  }

  setEpisodesPage(page: number) {
    this.setState({
      page,
    });
  }

  toggleSubscription(podcast: IPodcast) {
    const subscriptions = [...this.state.subscriptions];
    const existingIndex = subscriptions.findIndex(
      (sub) => sub.feedUrl === podcast.feedUrl
    );
    let verb;
    if (existingIndex >= 0) {
      subscriptions.splice(existingIndex, 1);
      verb = "Unsubscribed from";
    } else {
      subscriptions.push(podcast);
      verb = "Subscribed to";
    }

    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(subscriptions));
    console.log({ subscriptions });
    this.setState({ subscriptions });
    this.toast.alert(`${verb} "${podcast.collectionName}"`);
  }

  async loadSubscriptions() {
    try {
      const subs = localStorage.getItem(this.COOKIE_NAME);
      let subscriptions = [];
      if (subs) {
        try {
          subscriptions = JSON.parse(subs) || [];
        } catch (ex: any) {
          console.log(ex.message);
        }
      }
      this.setState({ subscriptions });
      return subscriptions;
    } catch (error: any) {
      this.setState({ error: error.message });
      throw error;
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setState(updates: Partial<IState>) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  setView(view: string) {
    const updates = {
      view,
      pages: 1,
    };

    this.setState(updates);
  }

  async searchByParam(term: string) {
    this.setState({ ready: false, error: null });
    try {
      const response = await getPodcasts(term);
      this.setState({
        loading: false,
        results: response.results || [],
        page: 1,
        view: "search",
      });
      return response;
    } catch (error: any) {
      this.setState({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  }

  parseResponse(val: any): any {
    return JSON.parse(val);
  }

  async fetchPodcastDetail(url: string) {
    this.setState({ loading: true, error: null });
    try {
      console.log("Fetching podcast detail from:", url);
      const response = await this.getPodcast(url);
      console.log("Podcast detail response type:", typeof response);

      this.setState({
        loading: false,
        detail: this.parseResponse(response),
        page: 1,
      });

      // Parse and store episodes for pagination
      if (this.parser && typeof this.parser.parseRssFeed === "function") {
        const episodes = this.parser.parseRssFeed(response);
        console.log({ episodes });
        this.setEpisodes(episodes);
        console.log(`Loaded ${episodes.length} episodes for pagination`);
      }

      return response;
    } catch (error: any) {
      console.error("Error fetching podcast detail:", error);
      this.setState({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  }

  setEpisodes(episodes: any) {
    this.setState({
      episodes: episodes || [],
      totalEpisodes: episodes ? episodes.length : 0,
      currentEpisodesPage: 1, // Reset to first page when episodes change
      view: "detail",
    });
    console.log(`Set ${episodes ? episodes.length : 0} episodes in store`);
  }

  setCurrentPodcast(podcast: IPodcast) {
    this.setState({
      currentPodcast: podcast,
      page: 1,
    });
  }

  expandNode(guid: string) {
    this.setState({
      expandedNodes: {
        ...this.state.expandedNodes,
        [guid]: !this.state.expandedNodes[guid],
      },
    });
  }

  // You might want to add the API methods as class methods:
  async getPodcasts(term: string) {
    return await getPodcasts(term);
  }

  async getPodcast(url: string) {
    return await getPodcast(url);
  }

  getState() {
    return this.state;
  }

  //audio states
  stopAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.src = "";
    }
    this.setState({
      currentTrack: null,
      trackList: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      bodycss: "workspace",
    });
  }

  pauseAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.setState({ isPlaying: false });
    }
  }
  resumeAudio() {
    if (this.audioElement) {
      this.audioElement.play();
      this.setState({ isPlaying: true });
    }
  }

  skipForward(seconds = 15) {
    if (this.audioElement) {
      this.audioElement.currentTime += seconds;
    }
  }

  togglePlayPause() {
    if (this.state.isPlaying) {
      this.pauseAudio();
    } else {
      this.resumeAudio();
    }
  }

  seekTo(percent: number) {
    alert(1);
    if (this.audioElement && this.state.duration) {
      // Ensure time is within valid range
      const time = this.state.duration * percent;
      const validTime = Math.max(0, Math.min(time, this.state.duration));
      console.log("Seeking to:", validTime, "of", this.state.duration);

      this.audioElement.currentTime = validTime;
      this.setState({ currentTime: validTime });
    } else {
      console.warn("Cannot seek: no audio element or duration not loaded");
    }
  }

  playEpisode(episode: ParsedEpisode) {
    if (!episode.enclosure || !episode.enclosure.url) {
      this.setState({ error: "No audio URL available for this episode" });
      return;
    }

    // Create track object
    const track: ITrack = {
      title: episode.title,
      audioUrl: episode.enclosure.url,
      guid: episode.guid,
      description: episode.description,
      duration: episode.duration,
      episode: episode,
    };

    // Use the stored episodes for trackList, or parse from detail if needed
    let trackList = this.state.episodes;

    this.setCurrentTrack(track, trackList);
    this.playAudio();
  }

  playNextTrack() {
    const index =
      this.state.episodes?.findIndex(
        (f) => f.guid === this.state.currentTrack?.guid
      ) || 0;
    const nextEp = this.state.episodes?.[index + 1];
    if (nextEp) this.playEpisode(nextEp);
  }

  playAudio() {
    if (!this.state.currentTrack || !this.state.currentTrack.audioUrl) {
      console.error("No track to play");
      return;
    }

    this.setState({ loading: true });

    this.initAudioElement();

    // Set audio source
    this.audioElement.src = this.state.currentTrack.audioUrl;
    this.audioElement.load();

    // Set current volume and playback rate
    // this.audioElement.volume = this.state.volume;
    // this.audioElement.playbackRate = this.state.playbackRate;

    const trackMemory = JSON.parse(localStorage.getItem("trackMemory") || "{}");

    const progress = trackMemory[this.state.currentTrack!.guid];
    // Play the audio
    this.audioElement
      .play()
      .then(() => {
        this.setState({ isPlaying: true });
        this.resumeLocal(progress);
        this.toast.alert(`Now playing "${this.state.currentTrack?.title}"`);
      })
      .catch((error: any) => {
        console.error("Error playing audio:", error);
        this.setState({
          isPlaying: false,
          error: "Failed to play audio: " + error.message,
        });
      });
  }

  initAudioElement() {
    // Create audio element if it doesn't exist
    if (!this.audioElement) {
      this.audioElement = new Audio();
    }
    this.setupAudioEvents();
  }

  resumeLocal(memory: ITrackMemory) {
    setTimeout(() => {
      if (memory.guid) {
        const currentTime =
          (Number(memory.progress) / 100) * this.audioElement.duration;
        this.audioElement.currentTime = currentTime;
      }
    }, 99);
  }

  setupAudioEvents() {
    if (this.audioAttached) return;
    this.audioElement.addEventListener("loadedmetadata", () => {
      this.setState({ loading: false });
    });

    // Use requestAnimationFrame for time updates instead of throttling
    let lastTimeUpdate = 0;
    const updateTime = () => {
      if (this.audioElement && !this.audioElement.paused) {
        const currentTime = this.audioElement.currentTime;
        const now = Date.now();

        // Only update state if time changed significantly or enough time passed
        if (
          Math.abs(currentTime - this.state.currentTime) > 1 ||
          now - lastTimeUpdate > 1000
        ) {
          this.setState({ currentTime });
          lastTimeUpdate = now;
        }

        // requestAnimationFrame(updateTime);
      }
    };

    this.audioElement.addEventListener("play", () => {
      this.setState({ isPlaying: true });
      updateTime();
    });

    // this.audioElement.addEventListener("timeupdate", () => {
    //   updateTime();
    // });

    this.audioElement.addEventListener("pause", () => {
      this.setState({ isPlaying: false });
    });

    this.audioElement.addEventListener("ended", () => {
      this.setState({ isPlaying: false });
      this.playNextTrack();
    });

    this.audioElement.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      this.setState({
        isPlaying: false,
        error: "Failed to play audio: " + this.audioElement.error?.message,
      });
    });
    this.audioAttached = true;
  }

  setCurrentTrack(track: any, trackList: any) {
    const updates = {
      currentTrack: track,
      trackList,
      bodycss: "workspace playing",
    };

    this.setState(updates);
  }
}
