import type { IPodcast, IState, ParsedEpisode } from "../interfaces";
import { formatDuration, usePagination } from "../util";

function drill(obj: any, above: any = {}): any {
  if (!obj.elements?.length) {
    return above;
  }
  return drill(obj.elements[0], obj);
}

export const renderPodcastDetail = async (state: IState): Promise<string> => {
  const trackList: ParsedEpisode[] | undefined = state.episodes;

  const trackMemory = JSON.parse(localStorage.getItem("trackMemory") || "{}");

  const pages = usePagination(trackList, {
    page: state.page || 1,
    pageSize: 10,
  });

  const isSubscribed = (item: IPodcast | undefined): boolean => {
    return (
      state.subscriptions.find(
        (sub) => sub.collectionId === item?.collectionId
      ) !== undefined
    );
  };

  const drilled = drill(state.detail);
  let description = "";
  if (drilled?.elements) {
    const descNode = drilled.elements.find(
      (f: any) => f.name === "description"
    );
    console.log({ descNode });
    if (descNode) {
      description = descNode.elements[0].text;
    }
  }
  //drilled.elements[4].elements
  console.log({ drilled });

  const podcastInfo = state.currentPodcast;

  let html = `<div>`;

  if (podcastInfo) {
    const safePodcastData = JSON.stringify(podcastInfo).replace(/'/g, "&apos;");
    html += `  
      <div class="mb-4 p-3 bg-light rounded" style="max-height: 240px; overflow: auto;">
        <div class="d-flex gap-3">
          ${
            podcastInfo.artworkUrl600
              ? `
            <img src="${podcastInfo.artworkUrl600}"  class="detail-image rounded object-fit-cover" />
          `
              : ""
          }
          <div>
            <div class="subscribe-btn text-muted text-sm link" style="cursor: pointer;"  data-podcast='${safePodcastData}'>
              <i class="fa-${
                isSubscribed(podcastInfo) ? "solid" : "regular"
              } fa-star"></i>
              ${isSubscribed(podcastInfo) ? "Unsubscribe" : "Subscribe"}
            </div>
            <b>${podcastInfo.collectionName}</b>
            <p class="text-muted mb-0">${podcastInfo.artistName}</p>
            <p class="text-muted mb-0">${description}</p>
            <small class="text-muted">${trackList?.length} episodes</small>
          </div>
        </div>
      </div>
    `;
  }

  if (pages.pageCount > 1) {
    // Pagination controls
    html += `
    <div class="d-flex align-items-center  justify-content-center mb-3 gap-1">
      <button class="btn btn-outline-primary btn-sm page-num" ${
        pages.startNum === 0 ? "disabled" : ""
      }  data-page="${Number(state.page) - 1}">
        <i class="fa-solid fa-chevron-left"></i> Previous
      </button>
      <span class="text-muted">
        Page ${pages.startNum / 10 + 1} of ${pages.pageCount}
      </span>
      <button class="btn btn-outline-primary btn-sm page-num" ${
        pages.startNum + 10 >= (trackList?.length || 0) ? "disabled" : ""
      }  data-page="${Number(state.page) + 1}">
        Next <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;
  }

  html += '<div class="list-group">';

  pages.visible.forEach((item: any) => {
    const isCurrentTrack = state.currentTrack?.guid === item.guid;
    const trackClass = isCurrentTrack ? "bg-primary text-white" : "";
    const safeItemData = JSON.stringify(item).replace(/'/g, "&apos;");
    const finished =
      trackMemory[item.guid] && Number(trackMemory[item.guid].progress) > 98;

    html += `
      <div class="list-group-item d-flex gap-3 align-items-start ${trackClass}" >
       
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">

            <div>
            
              <div class=" ${
                isCurrentTrack ? "text-white text-truncate" : "text-truncate"
              } ${finished ? "text-muted" : "fw-bold"}" 
                   style="cursor: pointer; max-width: 50vw;"  
                   data-guid="${item.guid}">
                ${item.title}
              </div>

              ${
                item.duration
                  ? `
                <span class="badge bg-secondary me-2">${formatDuration(
                  item.duration
                )}</span>
              `
                  : ""
              }

              ${
                item.pubDate
                  ? `
                <small class="text-muted">${new Date(
                  item.pubDate
                ).toLocaleDateString()}</small>
              `
                  : ""
              }
            </div>

            <button class="btn btn-${
              isCurrentTrack ? "warning" : "primary"
            } btn-sm" 
                 data-episode='${safeItemData}'>
              <i class="p-1 fa-solid ${
                isCurrentTrack ? "fa-pause" : "fa-play"
              }"></i>
              ${
                isCurrentTrack
                  ? "Pause"
                  : trackMemory[item.guid] && !finished
                  ? "Resume"
                  : "Play"
              }
            </button>
          </div>

          ${
            trackMemory[item.guid] && trackMemory[item.guid].progress
              ? `<div>
              <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-info" style="width: ${
                  trackMemory[item.guid].progress
                }%"></div>
              </div> 
              </div>`
              : ""
          }

          ${
            state.expandedNodes[item.guid]
              ? `
            <div class="mt-2 small" style="max-height: 200px; overflow: auto; color: ${
              isCurrentTrack ? "rgba(255,255,255,0.8)" : "inherit"
            }">
              ${item.description || ""}
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  });

  html += "</div></div>";

  return html;
};
