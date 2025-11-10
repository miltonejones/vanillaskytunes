import type { IState } from "../interfaces";
import { renderPodcastCard } from "./podcastCard";

export function renderCategories(state: IState) {
  if (state.podcasts.length === 0) {
    return `
          <div class="text-center py-5">
              <h3>No categories found</h3>
              <p class="text-muted">Try refreshing the page or check your connection.</p> 
          </div>
      `;
  }

  const groups = state.podcasts.reduce((out: { [key: string]: any[] }, pod) => {
    const genre = pod.primaryGenreName || "unknown";
    out[genre] = (out[genre] || []).concat(pod);
    return out;
  }, {});

  return Object.keys(groups)
    .filter((key) => groups[key].length > 5)
    .map((key) => {
      return `
          <div class="row">
              <div class="col-12">
                  <h2 class="mb-4">${key}</h2>
              </div>
              ${groups[key]
                .map((podcast) => renderPodcastCard(podcast, state))
                .join("")}
          </div>
      `;
    })
    .join("");

  // return `<pre>${JSON.stringify(groups, null, 2)}</pre>`;
}
