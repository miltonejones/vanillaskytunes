// audioPlayer.ts
import type { IState, ITrackMemory } from "../interfaces";
import { renderPlaylist } from "../views/playlist";

interface IAudioState {
  currentTime: number;
  duration: number;
  progress: number;
  trackMemory: { [guid: string]: ITrackMemory };
}

export class AudioPlayer {
  private playerElement: HTMLElement | null = null;
  private store: any;
  private audioState: IAudioState;
  private listeners: any[] = [];

  constructor(store: any) {
    this.store = store;
    this.audioState = {
      currentTime: 0,
      duration: 0,
      progress: 0,
      trackMemory: {},
    };
    this.initializePlayer();
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.audioState));
  }

  setState(updates: any) {
    this.audioState = { ...this.audioState, ...updates };
    this.notify();
  }

  subscribe(listener: any) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private initializePlayer() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.createPlayerElement()
      );
    } else {
      this.createPlayerElement();
    }

    this.store.subscribe((state: IState) => {
      this.render(state);
    });
    this.subscribe((state: IAudioState) => {
      this.setTimes(state);
    });

    const trackMemory = JSON.parse(localStorage.getItem("trackMemory") || "{}");
    console.log({ trackMemory });
    this.setState({ trackMemory });
  }

  private createPlayerElement() {
    this.playerElement = document.getElementById("audio-player-container");
    if (this.playerElement) {
      this.bindPlayerEvents();
    }
  }

  private bindPlayerEvents() {
    if (!this.playerElement) return;

    // Progress slider
    const progressSlider = this.playerElement.querySelector(
      "[data-control='progress']"
    ) as HTMLInputElement;
    progressSlider?.addEventListener("input", (e) => this.handleSeek(e));
    const audioElement = this.store.audioElement;
    audioElement.addEventListener("loadedmetadata", () => {
      this.setState({ duration: audioElement.duration });
    });

    let lastTimeUpdate = 0;
    const updateTime = () => {
      if (audioElement && !audioElement.paused) {
        const currentTime = audioElement.currentTime;
        const now = Date.now();

        // Only update state if time changed significantly or enough time passed
        if (
          Math.abs(currentTime - this.audioState!.currentTime) > 1 ||
          now - lastTimeUpdate > 1000
        ) {
          this.setState({ currentTime });
          this.updateProgressLocal(this.audioState);
          lastTimeUpdate = now;
        }
      }
    };

    audioElement.addEventListener("timeupdate", () => {
      updateTime();
    });
  }

  updateProgressLocal(state: IAudioState) {
    const currentTime = state.currentTime || 0;

    const duration = state.duration || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const trackMemory = {
      ...this.audioState.trackMemory,
      [this.store.state.currentTrack.guid]: {
        progress,
        guid: this.store.state.currentPodcast.feedUrl,
      },
    };

    this.setState({ trackMemory });
    localStorage.setItem("trackMemory", JSON.stringify(trackMemory));
  }

  private handleSeek(event: Event) {
    const audio = this.store.audioElement;
    if (!audio) return;

    const slider = event.target as HTMLInputElement;
    const percent = Number(slider.value) / 100;
    audio.currentTime = audio.duration * percent;
  }

  private formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  public setTimes(state: IAudioState) {
    if (!this.playerElement) return alert("No player element");
    const currentTime = state.currentTime || 0;

    const duration = state.duration || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Update time displays
    const currentTimeEl = this.playerElement.querySelector(
      "[data-display='current-time']"
    );
    if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);

    const durationEl = this.playerElement.querySelector(
      "[data-display='duration']"
    );
    if (durationEl) durationEl.textContent = this.formatTime(duration);

    // Update progress slider
    const progressSlider = this.playerElement.querySelector(
      "[data-control='progress']"
    ) as HTMLInputElement;
    if (progressSlider) {
      progressSlider.value = progress.toString();
    }
  }

  public render(state: IState) {
    if (!this.playerElement) return alert("No player element");

    const isOpen = !!state.currentTrack;
    const isPlaying = state.isPlaying || false;
    renderPlaylist(state);

    // Update visibility
    if (isOpen) {
      this.playerElement.style.bottom = "0";
      document.body.classList.add("player-open");
    } else {
      this.playerElement.style.bottom = "-200px";
      document.body.classList.remove("player-open");
    }

    if (!state.currentTrack) return;

    // Update track info
    const titleEl = this.playerElement.querySelector("[data-display='title']");
    if (titleEl) titleEl.textContent = state.currentTrack.title || "";

    const imageEl = this.playerElement.querySelector(
      "[data-display='image']"
    ) as HTMLImageElement;
    if (imageEl && state.currentPodcast?.artworkUrl600) {
      imageEl.src = state.currentPodcast.artworkUrl600;
      imageEl.style.display = "block";
    }

    // Update play/pause icon
    const playIcon = this.playerElement.querySelector(
      "[data-icon='play-pause']"
    );
    if (playIcon) {
      playIcon.className = isPlaying
        ? "fa-solid fa-circle-pause"
        : "fa-solid fa-circle-play";
    }
  }

  public update(state: IState) {
    this.render(state);
  }
}
