import type { IState, ParsedEpisode } from "../interfaces";
import { formatDuration } from "../util";

export function renderPlaylist(state: IState) {
  const body = document.getElementById("offbody");
  let html = "";
  html += '<div class="list-group">';

  state.trackList?.forEach((item: ParsedEpisode) => {
    const isCurrentTrack = state.currentTrack?.guid === item.guid;
    const trackClass = isCurrentTrack ? "bg-primary text-white" : "";
    const safeItemData = JSON.stringify(item).replace(/'/g, "&apos;");

    html += `
      <div class="list-group-item d-flex gap-3 align-items-start ${trackClass}" data-episode='${safeItemData}'> 
        <div>
                
            <div class="fw-bold ${
              isCurrentTrack ? "text-white text-truncate" : "text-truncate"
            }" 
                style="cursor: pointer; max-width: 50vw;"  
                data-guid="${item.guid}">
                ${item.title}
            </div>

            ${
              item.duration
                ? `
                <span class="badge bg-secondary me-2">${formatDuration(
                  Number(item.duration)
                )}</span>
            `
                : ""
            } 
        
        </div> 
      </div> `;
  });

  html += "</div>";

  body!.innerHTML = html;

  const titleEl = document.querySelector("[data-display='title']");
  if (titleEl) titleEl.textContent = state.currentPodcast?.collectionName || "";
}
