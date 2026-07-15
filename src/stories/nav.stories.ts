import type { Meta, StoryObj } from "@storybook/html";
import { createNavigationBar } from "../components/nav";

const meta = {
  title: "Components/NavigationBar",
  tags: ["autodocs"],
  render: () => {
    const container = document.createElement("div");
    container.innerHTML = createNavigationBar();

    // Add event listeners for navigation
    container.querySelectorAll("[data-view]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const view = (e.currentTarget as HTMLElement).getAttribute("data-view");
        console.log(`Navigation clicked: ${view}`);

        document.querySelectorAll(".nav-link[data-view]").forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("data-view") === view
          );
        });
      });
    });

    return container;
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive navigation bar for the StateCast podcast application with home, categories, and subscriptions sections.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithSubscriptions: Story = {
  render: () => {
    const container = document.createElement("div");
    container.innerHTML = createNavigationBar();

    // Update subscription count
    const badge = container.querySelector("#subscription-count");
    if (badge) {
      badge.textContent = "(5)";
    }

    return container;
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithSearchQuery: Story = {
  render: () => {
    const container = document.createElement("div");
    container.innerHTML = createNavigationBar();

    // Pre-fill search input
    const searchInput = container.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "Tech podcasts";
    }

    return container;
  },
};
