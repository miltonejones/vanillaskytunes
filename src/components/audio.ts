export function renderAudioPlayer() {
  return `
     <button
        type="button"
        class="btn-close audio-close"
        aria-label="Close"
      ></button>

      <button
        class="player-btn menu-btn mobile"
        data-action="show-menu"
        title="Show playlist"
      >
        <i class="fa-solid fa-list-check"></i>
      </button>

      <div class="player-controls">
        <!-- Track Info -->
        <div class="player-track-info">
          <img
            data-display="image"
            class="player-track-image"
            src=""
            alt="Track artwork"
            style="display: none"
          />
          <div>
            <p class="player-track-title" data-display="title">
              No track playing
            </p>
          </div>
        </div>

        <!-- Playback Controls <i class="fa-solid fa-list-check"></i> -->
        <div class="player-buttons">
          <button
            class="player-btn menu-btn"
            data-action="show-menu"
            title="Show playlist"
          >
            <i class="fa-solid fa-list-check"></i>
          </button>

          <button
            class="player-btn skip-btn"
            data-action="skip-back"
            title="Rewind 30 seconds"
          >
            <i class="fa-solid fa-arrow-rotate-left"></i>
            <span class="skip-btn-label">30</span>
          </button>

          <button
            class="player-btn player-btn-large"
            data-action="play-pause"
            title="Play/Pause"
          >
            <i data-icon="play-pause" class="fa-solid fa-circle-play"></i>
          </button>

          <button
            class="player-btn skip-btn"
            data-action="skip-forward"
            title="Forward 30 seconds"
          >
            <i class="fa-solid fa-arrow-rotate-right"></i>
            <span class="skip-btn-label">30</span>
          </button>
        </div>

        <!-- Progress Bar -->
        <div class="player-progress">
          <span class="player-time" data-display="current-time">0:00</span>
          <input
            type="range"
            class="player-slider"
            data-control="progress"
            min="0"
            max="100"
            value="0"
          />
          <span class="player-time" data-display="duration">0:00</span>
        </div>

        <!-- Close Button -->
        <button class="player-btn" data-action="close" title="Close player">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
  `;
}
