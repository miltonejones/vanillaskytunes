// podcastDetail.stories.ts
import type { Meta, StoryFn } from "@storybook/html";
import type { IState, ITrack, ParsedEpisode } from "../interfaces";
import { renderPodcastDetail } from "../views";
// import { subscriptions } from "./data/subscriptions";
import { podcasts } from "./data/podcasts";
import { mockState } from "./data/state";

// Mock episodes data
const mockEpisodes: ParsedEpisode[] = mockState.episodes.slice(0, 50);

// Mock XML detail data
const mockDetail = {
  elements: [
    {
      elements: [
        {
          elements: [
            {
              name: "description",
              elements: [
                {
                  text: "This is a detailed description of the podcast. It covers various topics related to technology, programming, and software development. Join us every week as we explore new trends and share insights from industry experts.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Mock track memory for progress bars
const mockTrackMemory = {
  "episode-1": { progress: 100 },
  "episode-2": { progress: 45 },
  "episode-3": { progress: 75 },
  "episode-4": { progress: 10 },
  "episode-5": { progress: 0 },
};

const meta: Meta = {
  title: "Components/PodcastDetail",
  parameters: {
    layout: "padded",
  },
  argTypes: {
    state: { control: "object" },
    currentPage: { control: "number" },
    hasProgress: { control: "boolean" },
    isSubscribed: { control: "boolean" },
    currentTrackGuid: { control: "text" },
  },
};

export default meta;

// Template for our stories
const Template: StoryFn<{
  state: Partial<IState>;
  currentPage: number;
  hasProgress: boolean;
  isSubscribed: boolean;
  currentTrackGuid: string;
  progressTrackGuid?: string;
  progressCompleteGuid?: string;
}> = (args) => {
  // Mock localStorage for progress tracking
  if (args.hasProgress && args.progressTrackGuid) {
    let memory = {
      ...mockTrackMemory,
      [args.progressTrackGuid]: { progress: 30 },
    };

    if (args.progressCompleteGuid) {
      memory = {
        ...memory,
        [args.progressCompleteGuid]: { progress: 100 },
      };
    }
    localStorage.setItem("trackMemory", JSON.stringify(memory));
  } else {
    localStorage.removeItem("trackMemory");
  }

  const currentTrack = mockEpisodes.find(
    (episode) => episode.guid === args.currentTrackGuid
  ) as unknown as ITrack;

  // Prepare state
  const state: Partial<IState> = {
    ...args.state,
    // episodes: mockEpisodes,
    detail: mockDetail,
    page: args.currentPage,
    currentPodcast: podcasts[2],
    subscriptions: args.isSubscribed ? [podcasts[2]] : [],
    expandedNodes: {},
    currentTrack,
  };

  let currentState = { ...state };

  const container = document.createElement("div");
  container.className = "container";

  const renderDetail = () => {
    container.innerHTML = renderPodcastDetail(currentState);
  };
  renderDetail();

  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    console.log("Clicked:", target);

    if (target.matches("[data-guid]") || target.closest("[data-guid]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-guid]");
      const guid = viewElement!.getAttribute("data-guid");
      currentState = {
        ...currentState,
        expandedNodes: {
          ...currentState.expandedNodes,
          [guid!]: !currentState.expandedNodes?.[guid!],
        },
      };
      renderDetail();
      return;
    }

    if (
      target.matches("[data-sort-field]") ||
      target.closest("[data-sort-field]")
    ) {
      e.preventDefault();
      const viewElement = target.closest("[data-sort-field]");
      const field = viewElement!.getAttribute("data-sort-field");
      currentState = {
        ...currentState,
        sortField: field!,
        ascOffset: (currentState.ascOffset || 1) * -1,
      };
      renderDetail();
      return;
    }
    if (target.matches("[data-page]") || target.closest("[data-page]")) {
      e.preventDefault();
      const viewElement = target.closest("[data-page]");
      const page = viewElement!.getAttribute("data-page");
      currentState = {
        ...currentState,
        page: Number(page),
      };

      renderDetail();
      return;
    }
  });

  console.log({ mockEpisodes });
  return container;
};

// Stories
export const Default = Template.bind({});
Default.args = {
  state: mockState,
  currentPage: 1,
  hasProgress: false,
  isSubscribed: false,
  currentTrackGuid: "",
};
Default.parameters = {
  docs: {
    description: {
      story:
        "Default podcast detail view with episode list and podcast information.",
    },
  },
};

export const Subscribed = Template.bind({});
Subscribed.args = {
  ...{
    ...Default.args,
    state: {
      ...Default.args.state,
      sortField: "pubDate",
    },
  },
  isSubscribed: true,
};
Subscribed.parameters = {
  docs: {
    description: {
      story:
        "Podcast detail view showing subscribed state with filled star icon.",
    },
  },
};

export const WithProgressBars = Template.bind({});
WithProgressBars.args = {
  ...Default.args,
  hasProgress: true,
  progressTrackGuid:
    "https://justcast.herokuapp.com/shows/fbi/audioposts/638646.mp3",
  progressCompleteGuid:
    "https://justcast.herokuapp.com/shows/fbi/audioposts/638603.mp3",
};
WithProgressBars.parameters = {
  docs: {
    description: {
      story:
        "Podcast detail view showing progress bars for episodes that have been partially listened to.",
    },
  },
};

export const WithCurrentTrack = Template.bind({});
WithCurrentTrack.args = {
  ...{
    ...Default.args,
    state: {
      ...Default.args.state,
      sortField: "pubDate",
      ascOffset: 1,
    },
  },
  hasProgress: true,
  currentTrackGuid:
    "https://justcast.herokuapp.com/shows/fbi/audioposts/638520.mp3",
};
WithCurrentTrack.parameters = {
  docs: {
    description: {
      story:
        "Podcast detail view highlighting the currently playing track with different styling.",
    },
  },
};

export const SecondPage = Template.bind({});
SecondPage.args = {
  state: {
    ...mockState,
    sortField: "pubDate",
    ascOffset: -1,
  },
  currentPage: 2,
  hasProgress: false,
  isSubscribed: false,
  currentTrackGuid: "",
};
SecondPage.parameters = {
  docs: {
    description: {
      story:
        "Podcast detail view showing the second page of episodes with pagination controls.",
    },
  },
};

export const FewEpisodes = Template.bind({});
FewEpisodes.args = {
  state: {
    ...mockState,
    episodes: mockEpisodes.slice(0, 2),
    sortField: "pubDate",
    ascOffset: 1,
  },
  currentPage: 1,
  hasProgress: false,
  isSubscribed: false,
  currentTrackGuid: "",
};
FewEpisodes.parameters = {
  docs: {
    description: {
      story:
        "Podcast detail view with only a few episodes (no pagination needed).",
    },
  },
};
