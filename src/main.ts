import "./style.css";
import type { IPodcast, IState } from "./interfaces";

import {
  renderHome,
  renderSearch,
  renderCategories,
  renderSubscriptions,
  renderPodcastDetail,
} from "./views";
import { PodcastCarouselController } from "./controllers/carousel";
import { AudioPlayer } from "./controllers/audioPlayer";
import { PodcastStore } from "./store";

class PodcastApp {
  store;
  initialized = false;
  eventsBound = false;
  carousel;
  player;
  constructor() {
    this.store = new PodcastStore(); // window.podcastStore;
    this.carousel = new PodcastCarouselController(this.store);
    this.player = new AudioPlayer(this.store);
  }

  async init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeApp());
    } else {
      await this.initializeApp();
    }
  }

  async initializeApp() {
    if (this.store) {
      this.store.subscribe((state: IState) => {
        // alert(JSON.stringify(state));
        this.render(state);
      });

      await this.store.initializeApp();
      this.initialized = true;
      setTimeout(() => {
        this.bindEvents();
      }, 100);
      return;
    }

    alert("No store");
  }

  bindEvents() {
    if (this.eventsBound) return;
    this.removeEventListeners();
    document.addEventListener("click", this.handleClick.bind(this), true);

    const searchInput = document.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;
    let timeoutId: number | null = null;
    const that = this;
    function handleSearch(): void {
      const searchValue = searchInput.value.trim();
      that.store.searchByParam(searchValue);
    }

    searchInput.addEventListener("input", () => {
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout
      timeoutId = setTimeout(handleSearch, 300);
    });

    this.eventsBound = true;
  }

  removeEventListeners() {
    // This method will be used to clean up event listeners if needed
    document.removeEventListener("click", this.handleClick);
    this.eventsBound = false;
  }

  handleInput(e: Event) {
    console.log("handleInput");
    const target = e.target as HTMLInputElement;
    if (target.matches("[data-control]") || target.closest("[data-control]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-control]");
      const control = viewElement!.getAttribute("data-control");
      if (control === "progress") {
        const percent = Number(target.value) / 100;
        this.store.seekTo(percent);
      }
      return;
    }
  }

  handleClick(e: MouseEvent) {
    console.log("handleClick");
    // Prevent event interference
    e.stopPropagation();

    let target = e.target as Element;

    // Navigation
    if (target.matches("[data-view]") || target.closest("[data-view]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-view]");
      const view = viewElement!.getAttribute("data-view");
      this.store.setView(view!);
      return;
    }

    if (target.matches("[data-guid]") || target.closest("[data-guid]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-guid]");
      const guid = viewElement!.getAttribute("data-guid");
      this.store.expandNode(guid!);
      return;
    }

    if (target.matches("[data-action]") || target.closest("[data-action]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-action]");
      const action = viewElement!.getAttribute("data-action");
      switch (action) {
        case "play-pause":
          this.store.togglePlayPause();
          break;
        case "skip-back":
          this.store.skipForward(-30);
          break;
        case "skip-forward":
          this.store.skipForward(30);
          break;
        case "show-menu":
          document.getElementById("offcanvas")?.classList.toggle("show");
          break;
        case "close":
          this.store.stopAudio();
          break;
        default:
        // do nothing
      }
      return;
    }

    if (target.matches("[data-episode]") || target.closest("[data-episode]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-episode]");
      const ep = viewElement!.getAttribute("data-episode");
      const episode = JSON.parse(ep!);
      this.store.playEpisode(episode);
      return;
    }

    if (target.matches("[data-page]") || target.closest("[data-page]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-page]");
      const page = viewElement!.getAttribute("data-page");

      this.store.setEpisodesPage(Number(page));
      return;
    }

    // Subscribe buttons
    if (target.matches(".subscribe-btn") || target.closest(".subscribe-btn")) {
      const button = target.closest(".subscribe-btn");
      if (!button) return;
      const podcastData = button.getAttribute("data-podcast");
      if (podcastData) {
        try {
          const podcast = JSON.parse(podcastData);
          this.store.toggleSubscription(podcast);
        } catch (error) {
          console.error("Error parsing podcast data:", error);
        }
      } else {
        alert("No podcast data was found");
      }
      return;
    }

    // Subscribe buttons
    if (target.matches(".btn-close") || target.closest(".btn-close")) {
      document.getElementById("offcanvas")?.classList.remove("show");
      return;
    }

    // Podcast card clicks (but not on subscribe buttons)
    if (
      (target.matches(".podcast-item") || target.closest(".podcast-item")) &&
      !target.matches(".subscribe-btn") &&
      !target.closest(".subscribe-btn")
    ) {
      const item = target.closest(".podcast-item");
      const podcastData = item!.getAttribute("data-podcast");
      if (podcastData) {
        try {
          const podcast = JSON.parse(podcastData);
          this.handlePodcastClick(podcast);
        } catch (error) {
          console.error("Error parsing podcast data:", error);
        }
      }
      return;
    }
  }

  handlePodcastClick(podcast: IPodcast) {
    this.store.setCurrentPodcast(podcast);
    if (podcast.feedUrl) {
      this.store.fetchPodcastDetail(podcast.feedUrl);
    }
  }
  //
  async render(state: IState) {
    const spinner = document.querySelector<HTMLDivElement>("#loading-spinner");
    state.loading
      ? spinner?.classList.remove("d-none")
      : spinner?.classList.add("d-none");
    let content: string = "";
    switch (state.view) {
      case "home":
        content = renderHome(state);
        break;
      case "search":
        content = renderSearch(state);
        break;
      case "categories":
        content = renderCategories(state);
        break;
      case "subscriptions":
        content = renderSubscriptions(state);
        break;
      case "detail":
        content = await renderPodcastDetail(state);
        break;
      default:
        content = renderHome(state);
    }
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = content;
    this.updateNavigation(state);
  }

  updateNavigation(state: IState) {
    // Update active nav link
    document.querySelectorAll(".nav-link[data-view]").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-view") === state.view
      );
    });

    // Update subscription count
    const subCount = document.getElementById("subscription-count");
    if (subCount) {
      subCount.textContent = `(${state.subscriptions.length})`;
    }
  }

  isSubscribed(podcast: IPodcast) {
    return this.store
      .getState()
      .subscriptions.some((sub) => sub.feedUrl === podcast.feedUrl);
  }

  drill(obj: any, above: any = {}): any {
    if (!obj.elements?.length) {
      return above;
    }
    return this.drill(obj.elements[0], obj);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new PodcastApp();
  app.init();
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = ` Loading... `;

export const getImageProps = (items: any) => {
  const isPic = (img: string) =>
    ["jpg", "jpeg", "png"].some((pic) => !!img && img.indexOf(pic) > 0);

  if (!items) return {};

  const imageMap = items.find((f: any) => isPic(f.url) || isPic(f.href));
  if (imageMap) {
    return {
      image: isPic(imageMap.url) ? imageMap.url : imageMap.href,
      ...imageMap,
    };
  }

  return {};
};
