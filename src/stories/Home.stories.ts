import type { Meta, StoryFn } from "@storybook/html";
import type { IState } from "../interfaces";
import { renderHome } from "../views";
import { subscriptions } from "./data/subscriptions";
import { podcasts } from "./data/podcasts";
import { PodcastStore } from "../store";
import { PodcastCarouselController } from "../controllers/carousel";
import { createNavigationBar } from "../components/nav";

const meta: Meta<{ state: Partial<IState>; limit: boolean }> = {
  title: "Layout/Home",
  argTypes: {
    state: {
      description:
        "Application state containing current view and navigation data",
      control: { type: "object" },
    },
  },
};

// Global cleanup function
const cleanupPreviousStory = () => {
  // Clean up any existing audio players
  const containers = document.querySelectorAll(
    "#podcast-carousel-story-container"
  );
  containers.forEach((container) => {
    container.remove();
  });

  carousels.forEach((carousel) => {
    carousel.destroy();
  });
};

const carousels: PodcastCarouselController[] = [];

const Template: StoryFn<{ state: Partial<IState>; limit?: boolean }> = (
  args
) => {
  cleanupPreviousStory();
  const container = document.createElement("div");
  container.id = "podcast-carousel-story-container";
  document.body.appendChild(container);

  const renderHomeContainer = () => {
    container.innerHTML = `<div class="workspace mt-4 ">
    <div id="nav">${createNavigationBar()}</div>
    <div id="extra"></div>
     ${renderHome(args.state as IState)}
     <footer>Storybook footer</footer>
  </div>`;

    const store = new PodcastStore();
    const carousel = new PodcastCarouselController(store);
    carousel.render(args.state);
    carousels.push(carousel);

    const subCount = document.getElementById("subscription-count");
    if (subCount) {
      subCount.textContent = `(${args.state.subscriptions?.length})`;
    }

    document.querySelectorAll(".nav-link[data-view]").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-view") === args.state.view
      );
    });
  };
  renderHomeContainer();
  return container;
};

export const Default = Template.bind({});
Default.args = {
  state: {
    view: "home",
    subscriptions: [],
    podcasts: podcasts,
  },
  limit: true,
};
export const WithSubscriptions = Template.bind({});
WithSubscriptions.args = {
  state: {
    view: "home",
    subscriptions,
    podcasts: podcasts,
  },
  limit: true,
};

export default meta;
