// audioPlayer.stories.ts
import type { Meta, StoryFn } from "@storybook/html";
import type { IState, ParsedEpisode, IPodcast, ITrack } from "../interfaces";
import { mockState } from "./data/state";
import { AudioPlayer } from "../controllers/audioPlayer";
import { PodcastStore } from "../store";
import { trackList } from "./data/trackList";

// Mock store implementation for Storybook
class MockStore {
  private state: IState;
  private subscribers: Array<(state: IState) => void> = [];
  public audioElement: HTMLAudioElement;

  constructor(initialState: IState) {
    this.state = initialState;
    this.audioElement = document.createElement("audio");
    this.setupMockAudio();
  }

  private setupMockAudio() {
    // Mock audio element properties and methods
    Object.defineProperty(this.audioElement, "duration", {
      get: () => 3600, // 1 hour in seconds
      configurable: true,
    });

    Object.defineProperty(this.audioElement, "currentTime", {
      get: () => 1200, // 20 minutes in seconds
      set: (value) => console.log("Setting currentTime to:", value),
      configurable: true,
    });

    Object.defineProperty(this.audioElement, "paused", {
      get: () => false,
      configurable: true,
    });

    // Mock event listeners
    // this.audioElement.addEventListener = jest.fn();
    // this.audioElement.removeEventListener = jest.fn();
    // this.audioElement.play = jest.fn(() => Promise.resolve());
    // this.audioElement.pause = jest.fn();
  }

  subscribe(callback: (state: IState) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  getState(): IState {
    return this.state;
  }

  setState(newState: Partial<IState>) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach((callback) => callback(this.state));
  }

  // Helper to simulate audio events
  simulateTimeUpdate(currentTime: number) {
    Object.defineProperty(this.audioElement, "currentTime", {
      get: () => currentTime,
      set: (value) => console.log("Setting currentTime to:", value),
      configurable: true,
    });

    // Trigger timeupdate event
    const event = new Event("timeupdate");
    this.audioElement.dispatchEvent(event);
  }

  simulateLoadedMetadata(duration: number) {
    Object.defineProperty(this.audioElement, "duration", {
      get: () => duration,
      configurable: true,
    });

    const event = new Event("loadedmetadata");
    this.audioElement.dispatchEvent(event);
  }
}

// Mock data
const mockCurrentTrack: ParsedEpisode = mockState.episodes[0];

const mockCurrentPodcast: IPodcast = {
  wrapperType: "track",
  kind: "podcast",
  collectionId: 1476944546,
  trackId: 1476944546,
  artistName: "OTR Gold",
  collectionName: "CBS Radio Mystery Theater | Old Time Radio",
  trackName: "CBS Radio Mystery Theater | Old Time Radio",
  collectionCensoredName: "CBS Radio Mystery Theater | Old Time Radio",
  trackCensoredName: "CBS Radio Mystery Theater | Old Time Radio",
  collectionViewUrl:
    "https://podcasts.apple.com/us/podcast/cbs-radio-mystery-theater-old-time-radio/id1476944546?uo=4",
  feedUrl: "https://feeds.megaphone.fm/VKRX3013755423",
  trackViewUrl:
    "https://podcasts.apple.com/us/podcast/cbs-radio-mystery-theater-old-time-radio/id1476944546?uo=4",
  artworkUrl30:
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/af/f8/e3/aff8e322-6919-1d1b-3207-180a19149854/mza_11511682816689724339.png/30x30bb.jpg",
  artworkUrl60:
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/af/f8/e3/aff8e322-6919-1d1b-3207-180a19149854/mza_11511682816689724339.png/60x60bb.jpg",
  artworkUrl100:
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/af/f8/e3/aff8e322-6919-1d1b-3207-180a19149854/mza_11511682816689724339.png/100x100bb.jpg",
  collectionPrice: 0,
  trackPrice: 0,
  collectionHdPrice: 0,
  releaseDate: "2019-08-09T05:00:00Z",
  collectionExplicitness: "notExplicit",
  trackExplicitness: "cleaned",
  trackCount: 1348,
  trackTimeMillis: 2786,
  country: "USA",
  currency: "USD",
  primaryGenreName: "Arts",
  contentAdvisoryRating: "Clean",
  artworkUrl600:
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/af/f8/e3/aff8e322-6919-1d1b-3207-180a19149854/mza_11511682816689724339.png/600x600bb.jpg",
  genreIds: ["1301", "26"],
  genres: ["Arts", "Podcasts"],
};

const mockPlaylistEpisodes: ParsedEpisode[] = [
  mockCurrentTrack,
  ...mockState.episodes.slice(1, 5),
];

// Mock track memory
const mockTrackMemory = {
  "current-track-1": {
    progress: 33.3, // 20 minutes of 60 minute episode
    guid: "https://example.com/feed.xml",
    duration: 3600,
    currentTime: 1200,
  },
  "playlist-2": {
    progress: 0,
    guid: "https://example.com/feed.xml",
    duration: 2700,
    currentTime: 0,
  },
};

const meta: Meta = {
  title: "Components/AudioPlayer",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    hasCurrentTrack: { control: "boolean" },
    isPlaying: { control: "boolean" },
    showPlaylist: { control: "boolean" },
    progress: { control: "number", min: 0, max: 100 },
  },
  // decorators: [
  //   (story) => {
  //     // Setup DOM container for audio player

  //   },
  // ],
};

export default meta;

// Template for our stories
const Template: StoryFn<{
  hasCurrentTrack: boolean;
  isPlaying: boolean;
  showPlaylist: boolean;
  progress: number;
}> = (args) => {
  console.log("Initializing audio player with args:", args);
  // Setup initial state based on args
  const initialState: IState = {
    ...mockState,
    currentTrack: undefined,
    currentPodcast: args.hasCurrentTrack ? mockCurrentPodcast : undefined,
    isPlaying: args.isPlaying,
    trackList: args.showPlaylist ? trackList.slice(0, 10) : [],
    episodes: [],
    subscriptions: [],
    page: 1,
    detail: {},
    expandedNodes: {},
  };

  // Initialize mock store
  const mockStore = new PodcastStore(initialState); // MockStore(initialState);

  // Initialize audio player
  const audioPlayer = new AudioPlayer(mockStore);
  audioPlayer.render(initialState);

  // Mock localStorage for track memory
  localStorage.setItem("trackMemory", JSON.stringify(mockTrackMemory));

  if (args.hasCurrentTrack) {
    mockStore.playEpisode(mockCurrentTrack, initialState.trackList || []);
  }

  const storyProps = `
    <div style="max-width: 800px; margin: 0 auto;">
      <h3>Audio Player Demo</h3>
      <p>The audio player appears at the bottom of the screen. Use Storybook controls to test different states.</p>
      
      <div class="card mt-4">
        <div class="card-body">
          <h5 class="card-title">Current State</h5>
          <ul>
            <li>Has Current Track: ${args.hasCurrentTrack}</li>
            <li>Is Playing: ${args.isPlaying}</li>
            <li>Show Playlist: ${args.showPlaylist}</li>
            <li>Progress: ${args.progress}%</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  console.log("Setting up audio player container for story");
  const container = document.createElement("div");
  container.innerHTML = ` 
        <div id="offbody" style="padding: 20px; min-height: 200px; background: #f5f5f5;position:fixed;right:0;top:0;z-index: 99"></div>
        <div class="main-content" style="padding: 20px;">
          ${storyProps}
        </div>
        <footer>Storybook footer</footer>
      `;
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    console.log("Container click event:", target);
    // Handle player button clicks
    if (target.matches("[data-action]") || target.closest("[data-action]")) {
      e.preventDefault();
      const actionElement = target.closest("[data-action]");
      const action = actionElement!.getAttribute("data-action");
      mockStore.handleClickAction(action!);
      return;
    }
  });
  return container;
};

// Stories
export const Default = Template.bind({});
Default.args = {
  hasCurrentTrack: false,
  isPlaying: false,
  showPlaylist: false,
  progress: 0,
};
Default.parameters = {
  docs: {
    description: {
      story: "Default audio player state when no track is currently playing.",
    },
  },
};

export const WithCurrentTrack = Template.bind({});
WithCurrentTrack.args = {
  hasCurrentTrack: true,
  isPlaying: false,
  showPlaylist: false,
  progress: 0,
};
WithCurrentTrack.parameters = {
  docs: {
    description: {
      story: "Audio player with a current track loaded but not playing.",
    },
  },
};

export const Playing = Template.bind({});
Playing.args = {
  hasCurrentTrack: true,
  isPlaying: true,
  showPlaylist: false,
  progress: 25,
};
Playing.parameters = {
  docs: {
    description: {
      story:
        "Audio player with a track currently playing and showing progress.",
    },
  },
};

export const WithPlaylist = Template.bind({});
WithPlaylist.args = {
  hasCurrentTrack: true,
  isPlaying: true,
  showPlaylist: true,
  progress: 50,
};
WithPlaylist.parameters = {
  docs: {
    description: {
      story: "Audio player with current track and playlist sidebar visible.",
    },
  },
};

export const NearCompletion = Template.bind({});
NearCompletion.args = {
  hasCurrentTrack: true,
  isPlaying: true,
  showPlaylist: true,
  progress: 95,
};
NearCompletion.parameters = {
  docs: {
    description: {
      story: "Audio player with a track that is nearly finished playing.",
    },
  },
};

export const WithArtwork = Template.bind({});
WithArtwork.args = {
  hasCurrentTrack: true,
  isPlaying: false,
  showPlaylist: false,
  progress: 0,
};
WithArtwork.parameters = {
  docs: {
    description: {
      story: "Audio player showing podcast artwork when available.",
    },
  },
};

// Custom story for testing progress tracking
export const ProgressTracking = () => {
  const container = document.createElement("div");
  container.innerHTML = `
    <div id="audio-player-container"></div>
    <div id="offbody" style="padding: 20px; min-height: 200px; background: #f5f5f5;"></div>
    <div style="padding: 20px;">
      <h3>Progress Tracking Test</h3>
      <p>This demo shows how the audio player tracks progress and saves it to localStorage.</p>
      
      <div class="card mt-4">
        <div class="card-body">
          <h5 class="card-title">Track Memory in localStorage</h5>
          <pre id="track-memory-display" style="background: #f8f9fa; padding: 10px; border-radius: 4px;"></pre>
        </div>
      </div>
    </div>
  `;

  // Initialize with a playing track
  const initialState: IState = {
    ...mockState,
    currentTrack: mockCurrentTrack as unknown as ITrack,
    currentPodcast: mockCurrentPodcast,
    isPlaying: true,
    trackList: mockPlaylistEpisodes.slice(0, 3),
    episodes: [],
    subscriptions: [],
    page: 1,
    detail: {},
    expandedNodes: {},
  };

  const mockStore = new MockStore(initialState);
  new AudioPlayer(mockStore);

  // Simulate progress updates
  let progress = 0;
  const interval = setInterval(() => {
    if (progress <= 100) {
      const currentTime = (progress / 100) * 3600;
      mockStore.simulateTimeUpdate(currentTime);

      // Update display
      const display = container.querySelector("#track-memory-display");
      if (display) {
        const trackMemory = JSON.parse(
          localStorage.getItem("trackMemory") || "{}"
        );
        display.textContent = JSON.stringify(trackMemory, null, 2);
      }

      progress += 10;
    } else {
      clearInterval(interval);
    }
  }, 1000);

  return container;
};
ProgressTracking.parameters = {
  docs: {
    description: {
      story:
        "Demonstrates how the audio player tracks playback progress and saves it to localStorage for resume functionality.",
    },
  },
};

// Custom story for testing player events
export const PlayerEvents = () => {
  const container = document.createElement("div");
  container.innerHTML = `
    <div id="audio-player-container"></div>
    <div id="offbody" style="padding: 20px; min-height: 200px; background: #f5f5f5;"></div>
    <div style="padding: 20px;">
      <h3>Player Events Test</h3>
      <p>Test various player events and interactions.</p>
      
      <div class="card mt-4">
        <div class="card-body">
          <h5 class="card-title">Event Log</h5>
          <div id="event-log" style="height: 200px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;"></div>
        </div>
      </div>
      
      <div class="mt-3">
        <button class="btn btn-primary me-2" id="simulate-play">Simulate Play</button>
        <button class="btn btn-secondary me-2" id="simulate-pause">Simulate Pause</button>
        <button class="btn btn-info me-2" id="simulate-seek">Simulate Seek to 50%</button>
        <button class="btn btn-warning" id="simulate-metadata">Simulate Metadata Load</button>
      </div>
    </div>
  `;

  const initialState: IState = {
    ...mockState,
    currentTrack: mockCurrentTrack as unknown as ITrack,
    currentPodcast: mockCurrentPodcast,
    isPlaying: false,
    trackList: [],
    episodes: [],
    subscriptions: [],
    page: 1,
    detail: {},
    expandedNodes: {},
  };

  const mockStore = new MockStore(initialState);
  new AudioPlayer(mockStore);

  // Add event logging
  const logEvent = (message: string) => {
    const eventLog = container.querySelector("#event-log");
    if (eventLog) {
      const timestamp = new Date().toLocaleTimeString();
      eventLog.innerHTML += `[${timestamp}] ${message}<br>`;
      eventLog.scrollTop = eventLog.scrollHeight;
    }
  };

  // Setup event buttons
  container.querySelector("#simulate-play")?.addEventListener("click", () => {
    mockStore.setState({ isPlaying: true });
    logEvent("Play event triggered");
  });

  container.querySelector("#simulate-pause")?.addEventListener("click", () => {
    mockStore.setState({ isPlaying: false });
    logEvent("Pause event triggered");
  });

  container.querySelector("#simulate-seek")?.addEventListener("click", () => {
    mockStore.simulateTimeUpdate(1800); // 50% of 60min episode
    logEvent("Seek to 50% (30 minutes)");
  });

  container
    .querySelector("#simulate-metadata")
    ?.addEventListener("click", () => {
      mockStore.simulateLoadedMetadata(2700); // 45 minutes
      logEvent("Metadata loaded: duration 45 minutes");
    });

  return container;
};
PlayerEvents.parameters = {
  docs: {
    description: {
      story:
        "Interactive demo to test various audio player events and their effects.",
    },
  },
};
