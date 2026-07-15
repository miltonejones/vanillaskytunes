import type { Meta, StoryFn } from "@storybook/html";
import type { IState } from "../interfaces";
import { paginationControls } from "../views/podcastDetail";
import { mockState } from "./data/state";

const meta: Meta<{ state: Partial<IState>; page: number }> = {
  title: "Components/Pagination",
  argTypes: {
    state: {
      description:
        "Application state containing current view and navigation data",
      control: { type: "object" },
    },
    page: {
      description: "Current page number for pagination",
      control: { type: "number", min: 1, step: 1 },
    },
  },
};

export default meta;

const Template: StoryFn<{ state: Partial<IState> }> = (args) => {
  const container = document.createElement("div");
  let initialState = { page: 1, ...args.state };
  document.body.appendChild(container);
  const renderPagination = () => {
    container.innerHTML = paginationControls(initialState);
  };
  renderPagination();
  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest(".page-num") as HTMLButtonElement;
    if (button) {
      const page = button.getAttribute("data-page");
      if (page) {
        initialState = { ...initialState, page: Number(page) };
        renderPagination();
      }
    }
  });
  return container;
};

export const Default = Template.bind({});
Default.args = {
  state: {
    view: "detail",
    episodes: mockState.episodes,
    page: 2,
  },
};

export const FirstPage = Template.bind({});
FirstPage.args = {
  state: {
    view: "detail",
    episodes: mockState.episodes,
    page: 1,
  },
};
