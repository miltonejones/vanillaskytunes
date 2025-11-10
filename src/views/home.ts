import type { IState } from "../interfaces";
import { renderPodcastCard } from "./podcastCard";
import { renderSubscriptions } from "./subscriptions";

export function renderHome(state: IState) {
  if (!state.ready && state.podcasts.length === 0) {
    return '<div class="text-center py-5"><div class="spinner-border"></div><p class="mt-2">Loading popular podcasts...</p></div>';
  }

  if (state.podcasts.length === 0) {
    return `
            <div class="text-center py-5">
                <h3>No popular podcasts found</h3>
                <p class="text-muted">Try refreshing the page or check your connection.</p> 
            </div>
        `;
  }

  return `
            ${renderSubscriptions(state, true)}
            <div class="row">
                <div class="col-12">
                    <h4 class="mb-4">Popular Podcasts</h4>
                </div>
                ${state.podcasts
                  .slice(0, 12)
                  .map((podcast) => renderPodcastCard(podcast, state))
                  .join("")}
            </div>
        `;
}
