import type { IState } from "../interfaces";
import { renderPodcastCard } from "./podcastCard";

export function renderSearch(state: IState) {
  if (state.results.length === 0) {
    return `
              <div class="text-center py-5">
                  <h3>No results for your search</h3>
                  <p class="text-muted">Start by searching for podcasts and subscribing to your favorites!</p>
              </div>
          `;
  }

  return `
          <div class="row">
              <div class="col-12">
                  <h2 class="mb-4">Search Results</h2>
              </div>
              ${state.results
                .map((podcast) => renderPodcastCard(podcast, state))
                .join("")}
          </div>
      `;
}
