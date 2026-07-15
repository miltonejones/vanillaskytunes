// carousel.stories.ts
import type { Meta, StoryFn } from "@storybook/html";
import type { IPodcast, IState } from "../interfaces";
import { PodcastCarouselController } from "../controllers/carousel";
import { podcasts } from "./data/podcasts";
import { mockState } from "./data/state";

// Mock store for the carousel controller
const createMockStore = (state: Partial<IState>) => {
  let currentState = { ...mockState, ...state };
  const subscribers: Array<(state: IState) => void> = [];

  return {
    getState: () => currentState as IState,
    subscribe: (callback: (state: IState) => void) => {
      subscribers.push(callback);
      callback(currentState as IState);
    },
  };
};

const meta: Meta = {
  title: "Components/PodcastCarousel",
  parameters: {
    layout: "padded",
  },
  argTypes: {
    podcasts: { control: "object" },
    autoPlayDelay: { control: "number" },
  },
};

export default meta;

// Global cleanup function
const cleanupPreviousStory = () => {
  // Clean up any existing audio players
  const containers = document.querySelectorAll("#extra");
  containers.forEach((container) => {
    container.remove();
  });
  const wrappers = document.querySelectorAll(
    "#podcast-carousel-story-container"
  );
  wrappers.forEach((container) => {
    container.remove();
  });
};

// Template for our stories
const Template: StoryFn<{
  podcasts: IPodcast[];
  autoPlayDelay?: number;
}> = (args) => {
  cleanupPreviousStory();
  const container = document.createElement("div");
  container.id = "podcast-carousel-story-container";
  container.innerHTML = '<div id="extra"></div>';
  document.body.appendChild(container);

  // Create mock store with podcasts
  const store = createMockStore({
    ...mockState,
    view: "home",
    podcasts: args.podcasts,
  });

  // Initialize carousel controller
  const controller = new PodcastCarouselController(
    store,
    args.autoPlayDelay || 6000
  );

  // Trigger initial render
  controller.render(store.getState());

  // Clean up on story unmount
  setTimeout(() => {
    return () => controller.destroy();
  }, 0);

  return container;
};

// Stories
export const Default = Template.bind({});
Default.args = {
  podcasts: [podcasts[0]],
};
Default.parameters = {
  docs: {
    description: {
      story: "Default carousel with a single podcast displayed.",
    },
  },
};

export const MultiplePodcasts = Template.bind({});
MultiplePodcasts.args = {
  podcasts: podcasts.slice(0, 5),
};
MultiplePodcasts.parameters = {
  docs: {
    description: {
      story:
        "Carousel with multiple podcasts. Auto-advances every 6 seconds with navigation controls.",
    },
  },
};

export const WithLongTitle = Template.bind({});
WithLongTitle.args = {
  podcasts: [podcasts[0]],
};
WithLongTitle.parameters = {
  docs: {
    description: {
      story:
        "Carousel displaying a podcast with a long title to test text overflow handling.",
    },
  },
};

export const FastAutoPlay = Template.bind({});
FastAutoPlay.args = {
  podcasts: podcasts.slice(0, 8),
  autoPlayDelay: 2000,
};
FastAutoPlay.parameters = {
  docs: {
    description: {
      story:
        "Carousel with faster auto-play (2 seconds) to demonstrate animation transitions.",
    },
  },
};

export const ManyPodcasts = Template.bind({});
ManyPodcasts.args = {
  podcasts: podcasts.slice(0, 12),
};
ManyPodcasts.parameters = {
  docs: {
    description: {
      story:
        "Full carousel with 12 podcasts showing continuous navigation through a large collection.",
    },
  },
};
