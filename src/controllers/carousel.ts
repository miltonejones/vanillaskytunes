import type { IPodcast, IState } from "../interfaces";

// podcastCarousel.ts
export function createPodcastCarousel(podcasts: IPodcast[]): string {
  if (!podcasts || podcasts.length === 0) {
    return '<div class="text-center p-4">No podcasts to display</div>';
  }

  const currentPodcast = podcasts[0];

  return `
  <h4>Listen Now</h4>
      <div class="podcast-carousel-container">
        <div class="carousel-wrapper">
          <!-- Current Slide -->
          <div class="carousel-slide current">
            ${createPodcastSlide(currentPodcast, true)}
          </div>
          
        </div>
      </div>
    `;
}

function createPodcastSlide(
  podcast: IPodcast,
  isActive: boolean = true
): string {
  if (!podcast) return "";

  const artworkUrl = podcast.artworkUrl600 || podcast.artworkUrl100 || "";
  const safePodcastData = JSON.stringify(podcast).replace(/'/g, "&apos;");

  return `
      <div class="podcast-slide-content">
        <!-- Background Image -->
        <div 
          class="slide-background" 
          style="background-image: url('${artworkUrl}')"
        ></div>
  
        <!-- Content Overlay -->
        <div class="slide-overlay">
          <!-- Podcast Info -->
          <div class="text-white podcast-info">
            <div class="podcast-title">${escapeHtml(
              podcast.collectionName || ""
            )}</div>
            <div class="podcast-meta">
              ${
                podcast.primaryGenreName
                  ? escapeHtml(podcast.primaryGenreName)
                  : ""
              } 
              ${podcast.trackCount ? `• ${podcast.trackCount} episodes` : ""}
            </div>
            <div 
              class="podcast-actions"
              style="opacity: ${
                isActive ? 1 : 0
              }; transition: opacity 0.3s ease;"
            >
              <button 
                data-podcast='${safePodcastData}'
                class="btn btn-primary btn-sm me-2 podcast-item"  
              >
                Listen Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
}

// Utility function to escape HTML
function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Carousel controller for JavaScript functionality
export class PodcastCarouselController {
  // private podcasts: IPodcast[] = [];

  private currentIndex: number = 0;
  private isAnimating: boolean = false;
  private autoPlayInterval?: number;
  private autoPlayDelay: number = 6000;
  private store: any;
  private isInitialized: boolean = false;

  constructor(store: any, autoPlayDelay: number = 6000) {
    this.store = store;
    this.autoPlayDelay = autoPlayDelay;
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    this.store.subscribe((state: IState) => {
      this.render(state);
    });
    this.isInitialized = true;
  }

  render(state: IState) {
    const extra = document.querySelector<HTMLDivElement>("#extra");

    if (state.view === "home" && state.podcasts.length > 0) {
      // Reset current index when returning to home
      this.currentIndex = 0;

      const htm = createPodcastCarousel(state.podcasts);
      extra!.innerHTML = htm;

      // Add event listeners for arrows
      this.attachEventListeners();

      // Clear any existing interval and start fresh
      this.clearAutoPlay();

      // Start auto-play immediately (no delay)
      this.startAutoPlay(state);
      return;
    }

    // Clear carousel and auto-play for other views
    if (extra) {
      extra.innerHTML = "";
    }
    this.clearAutoPlay();
  }

  private attachEventListeners(): void {
    const prevButton = document.querySelector(".carousel-arrow-prev");
    const nextButton = document.querySelector(".carousel-arrow-next");

    // Remove existing listeners first to prevent duplicates
    const newPrevButton = prevButton?.cloneNode(true) as HTMLElement;
    const newNextButton = nextButton?.cloneNode(true) as HTMLElement;

    if (prevButton && newPrevButton) {
      prevButton.parentNode?.replaceChild(newPrevButton, prevButton);
      newPrevButton.addEventListener("click", () => {
        this.prevSlide(this.store.getState());
      });
    }

    if (nextButton && newNextButton) {
      nextButton.parentNode?.replaceChild(newNextButton, nextButton);
      newNextButton.addEventListener("click", () => {
        this.nextSlide(this.store.getState());
      });
    }
  }

  nextSlide(state: IState): void {
    if (state.podcasts.length <= 1 || this.isAnimating) return;
    this.isAnimating = true;

    const carousel = document.querySelector(".podcast-carousel-container");
    if (!carousel) {
      this.isAnimating = false;
      return;
    }

    const wrapper = carousel.querySelector(".carousel-wrapper");
    const currentSlide = carousel.querySelector(".carousel-slide.current");

    if (!currentSlide || !wrapper) {
      this.isAnimating = false;
      return;
    }

    // Calculate next index
    const nextIndex = (this.currentIndex + 1) % state.podcasts.length;
    const nextPodcast = state.podcasts[nextIndex];

    // Create next slide positioned off-screen to the right
    const nextSlide = document.createElement("div");
    nextSlide.className = "carousel-slide";
    nextSlide.style.transform = "translateX(100%)";
    nextSlide.style.opacity = "0";
    nextSlide.innerHTML = createPodcastSlide(nextPodcast, false);

    wrapper.appendChild(nextSlide);

    // Force reflow to ensure initial position is rendered
    nextSlide.getBoundingClientRect();

    // Start animations
    requestAnimationFrame(() => {
      // Animate current slide out to the left
      currentSlide.classList.add("slide-out-left");

      // Animate next slide in from the right
      nextSlide.classList.add("slide-in-right");
      nextSlide.style.transform = "";
      nextSlide.style.opacity = "";
    });

    // Clean up after animation completes
    setTimeout(() => {
      if (wrapper.contains(currentSlide)) {
        wrapper.removeChild(currentSlide);
      }

      nextSlide.className = "carousel-slide current";
      nextSlide.classList.remove("slide-in-right");

      // Update button opacity to active
      const actions = nextSlide.querySelector(
        ".podcast-actions"
      ) as HTMLElement;
      if (actions) {
        actions.style.opacity = "1";
      }

      this.currentIndex = nextIndex;
      this.isAnimating = false;

      // Restart auto-play timer after manual navigation
      this.restartAutoPlay(state);
    }, 500); // Match CSS transition duration
  }

  prevSlide(state: IState): void {
    if (state.podcasts.length <= 1 || this.isAnimating) return;
    this.isAnimating = true;

    const carousel = document.querySelector(".podcast-carousel-container");
    if (!carousel) {
      this.isAnimating = false;
      return;
    }

    const wrapper = carousel.querySelector(".carousel-wrapper");
    const currentSlide = carousel.querySelector(".carousel-slide.current");

    if (!currentSlide || !wrapper) {
      this.isAnimating = false;
      return;
    }

    // Calculate previous index
    const prevIndex =
      (this.currentIndex - 1 + state.podcasts.length) % state.podcasts.length;
    const prevPodcast = state.podcasts[prevIndex];

    // Create previous slide positioned off-screen to the left
    const prevSlide = document.createElement("div");
    prevSlide.className = "carousel-slide";
    prevSlide.style.transform = "translateX(-100%)";
    prevSlide.style.opacity = "0";
    prevSlide.innerHTML = createPodcastSlide(prevPodcast, false);

    wrapper.appendChild(prevSlide);

    // Force reflow to ensure initial position is rendered
    prevSlide.getBoundingClientRect();

    // Start animations
    requestAnimationFrame(() => {
      // Animate current slide out to the right (but keep it visible during transition)
      currentSlide.classList.remove("current");
      (currentSlide as HTMLElement).style.transform = "translateX(100%)";
      (currentSlide as HTMLElement).style.opacity = "0";
      (currentSlide as HTMLElement).style.transition =
        "transform 0.5s ease-in-out, opacity 0.5s ease-in-out";

      // Animate previous slide in from the left
      prevSlide.classList.add("slide-in-left");
      prevSlide.style.transform = "";
      prevSlide.style.opacity = "";
    });

    // Clean up after animation completes
    setTimeout(() => {
      if (wrapper.contains(currentSlide)) {
        wrapper.removeChild(currentSlide);
      }

      prevSlide.className = "carousel-slide current";
      prevSlide.classList.remove("slide-in-left");
      prevSlide.style.transform = "";
      prevSlide.style.opacity = "";

      // Update button opacity to active
      const actions = prevSlide.querySelector(
        ".podcast-actions"
      ) as HTMLElement;
      if (actions) {
        actions.style.opacity = "1";
      }

      this.currentIndex = prevIndex;
      this.isAnimating = false;

      // Restart auto-play timer after manual navigation
      this.restartAutoPlay(state);
    }, 500); // Match CSS transition duration
  }

  private startAutoPlay(state: IState): void {
    if (state.podcasts.length <= 1) return;

    // Clear any existing interval first
    this.clearAutoPlay();

    this.autoPlayInterval = window.setInterval(() => {
      this.nextSlide(state);
    }, this.autoPlayDelay);
  }

  private restartAutoPlay(state: IState): void {
    this.clearAutoPlay();
    this.startAutoPlay(state);
  }

  clearAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = undefined;
    }
  }

  destroy(): void {
    this.clearAutoPlay();
    this.isInitialized = false;
  }
}

// Extend Window interface
declare global {
  interface Window {
    carousel: PodcastCarouselController;
  }
}
