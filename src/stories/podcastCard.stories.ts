// podcastCard.stories.ts
import type { Meta, StoryFn } from "@storybook/html";
import type { IPodcast, IState } from "../interfaces";
import { renderPodcastCard } from "../views";
import { trackMemory } from "./data/trackMemory";
import { subscriptions } from "./data/subscriptions";
import { podcasts } from "./data/podcasts";
import { mockState } from "./data/state";

// Mock data for our stories
const mockPodcast: IPodcast = podcasts[2];

const [podcast] = podcasts;

const mockPodcastWithLongName: IPodcast = podcast;

const mockPodcastInProgress: IPodcast = {
  ...mockPodcast,
  trackName: "In Progress Podcast",
  feedUrl: "https://example.com/in-progress-feed.xml",
};

const meta: Meta = {
  title: "Components/PodcastCard",
  parameters: {
    layout: "padded",
  },
  argTypes: {
    podcast: { control: "object" },
    state: { control: "object" },
    hasProgress: { control: "boolean" },
  },
};

export default meta;

// Template for our stories
const Template: StoryFn<{
  podcast: IPodcast;
  state: Partial<IState>;
  hasProgress: boolean;
}> = (args) => {
  // Mock localStorage for progress tracking
  if (args.hasProgress) {
    localStorage.setItem("trackMemory", JSON.stringify(trackMemory));
  } else {
    localStorage.removeItem("trackMemory");
  }

  return renderPodcastCard(args.podcast, args.state);
};
// Stories
export const Default = Template.bind({});
Default.args = {
  podcast: mockPodcast,
  state: { ...mockState, subscriptions: [] },
  hasProgress: false,
};

export const Subscribed = Template.bind({});
Subscribed.args = {
  podcast: podcasts[7],
  state: {
    ...mockState,
    subscriptions,
  },
  hasProgress: false,
};
Subscribed.parameters = {
  docs: {
    description: {
      story:
        'Podcast card showing a subscribed state with a filled star icon and "Unsubscribe" text.',
    },
  },
};

export const WithProgress = Template.bind({});
WithProgress.args = {
  podcast: podcasts[7],
  state: mockState,
  hasProgress: true,
};
WithProgress.parameters = {
  docs: {
    description: {
      story:
        "Podcast card showing progress bar when an episode is in progress (less than 99% complete).",
    },
  },
};

export const LongTitle = Template.bind({});
LongTitle.args = {
  podcast: mockPodcastWithLongName,
  state: { ...mockState, subscriptions: [] },
  hasProgress: false,
};
LongTitle.parameters = {
  docs: {
    description: {
      story:
        "Podcast card with a long title that should be truncated with ellipsis.",
    },
  },
};

export const GridLayout = () => {
  const podcastGrid: IPodcast[] = podcasts.slice(0, 12);

  const state: Partial<IState> = {
    ...mockState,
    subscriptions: [podcast],
  };

  // Mock progress for multiple items
  const trackMemory = {
    "episode-123": {
      guid: mockPodcastInProgress.feedUrl,
      progress: 45,
      duration: 300,
      currentTime: 135,
    },
    "episode-456": {
      guid: "https://example.com/another-feed.xml",
      progress: 75,
      duration: 300,
      currentTime: 225,
    },
  };
  localStorage.setItem("trackMemory", JSON.stringify(trackMemory));

  return `
    <div class="container-fluid">
      <div class="row">
        ${podcastGrid
          .map((podcast) => renderPodcastCard(podcast, state))
          .join("")}
      </div>
    </div>
  `;
};
GridLayout.parameters = {
  docs: {
    description: {
      story:
        "Multiple podcast cards arranged in a grid layout to demonstrate how they look together.",
    },
  },
};
