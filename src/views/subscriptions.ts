import type { IState } from "../interfaces";
import { renderPodcastCard } from "./podcastCard";

export function renderSubscriptions(state: IState, limit: boolean = false) {
  if (state.subscriptions.length === 0) {
    return `
              <div class="text-center py-5">
                  <h3>No subscriptions yet</h3>
                  <p class="text-muted">Start by searching for podcasts and subscribing to your favorites!</p>
              </div>
          `;
  }

  if (limit) {
    return `
  <div class="row">
      <div class="col-12 d-flex justify-content-between mb-2">
          <h4>${state.subscriptions.length} Subscriptions</h4>
          <button  class="btn btn-outline-primary btn-sm" data-view="subscriptions">View all <i class="fa-solid fa-arrow-right"></i></button>
      </div>
      ${state.subscriptions
        .slice(0, 6)
        .map((podcast) => renderPodcastCard(podcast, state))
        .join("")}
  </div>
`;
  }

  return `
          <div class="row">
              <div class="col-12">
                  <h2 class="mb-4">My Subscriptions</h2>
              </div>
              ${state.subscriptions
                .map((podcast) => renderPodcastCard(podcast, state))
                .join("")}
          </div>
      `;
}
