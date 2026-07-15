import type { Meta, StoryFn } from "@storybook/html";
import type { IState } from "../interfaces";
import { createNavigationBar } from "../components/nav";
import { renderSearch } from "../views";
import { searchResults } from "./data/results";

const meta: Meta<{ state: Partial<IState> }> = {
  title: "Layout/Search",
  argTypes: {
    state: {
      description:
        "Application state containing current view and navigation data",
      control: { type: "object" },
    },
  },
};

const Template: StoryFn<{ state: Partial<IState> }> = (args) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const renderSearchContainer = () => {
    container.innerHTML = `<div class="workspace mt-4">
      <div id="nav">${createNavigationBar()}</div>
         ${renderSearch(args.state as IState)}
       <footer>Storybook footer</footer>
      </div>`;
    document.querySelectorAll(".nav-link[data-view]").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-view") === args.state.view
      );
    });
  };
  renderSearchContainer();
  return container;
};

export const Default = Template.bind({});
Default.args = {
  state: {
    view: "search",
    results: [],
  },
};

export const WithResults = Template.bind({});
WithResults.args = {
  state: {
    view: "search",
    results: searchResults,
  },
};

export default meta;
