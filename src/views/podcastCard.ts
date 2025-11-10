import type { IPodcast, IState } from "../interfaces";
import { isSubscribed } from "../util";

export const renderPodcastCard = (podcast: IPodcast, state: IState): string => {
  const hasSubscription = isSubscribed(state, podcast);
  const safePodcastData = JSON.stringify(podcast).replace(/'/g, "&apos;");

  const trackMemory = JSON.parse(localStorage.getItem("trackMemory") || "{}");
  const thisCastKey = Object.keys(trackMemory)
    .filter((f) => trackMemory[f] && trackMemory[f].progress < 99)
    .find((f) => trackMemory[f].guid === podcast.feedUrl);

  const progress = thisCastKey ? trackMemory[thisCastKey].progress : 0;
  const progBar = progress
    ? `<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-info" style="width: ${progress}%"></div>
      </div>`
    : "";

  return `
    <div class="col-6 col-md-4 col-sm-6 col-lg-2 mb-4">
      <div 
        class="card h-100 cursor-pointer podcast-item"  
        style="cursor: pointer;"
        data-podcast='${safePodcastData}'
      >
        <img 
          src="${podcast.artworkUrl100}"
          alt="${podcast.trackName}"
          class="card-img-top"
          style="
            border-radius: 8px;
            object-fit: cover;
            height: 150px;
          "
        />
        <div class="card-body p-2">
          <p 
            class="card-text small fw-bold text-truncate mb-0" 
            style="line-height: 1.2;"
          >
            ${podcast.trackName}
          </p>
          <div class="card-text text-muted small subscribe-btn" data-podcast='${safePodcastData}'>
            <i class="fa-${hasSubscription ? "solid" : "regular"} fa-star"></i>
            ${hasSubscription ? "Unsubscribe" : "Subscribe"}
          </div> 
          ${progBar}
        </div>
      </div>
    </div>
  `;
};
