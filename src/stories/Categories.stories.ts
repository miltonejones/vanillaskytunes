import type { Meta, StoryFn } from "@storybook/html";
import type { IState } from "../interfaces";
import { renderCategories } from "../views";
import { podcasts } from "./data/podcasts";
import { createNavigationBar } from "../components/nav";

const meta: Meta<{ state: Partial<IState> }> = {
  title: "Layout/Categories",
  argTypes: {
    state: {
      description:
        "Application state containing current view and navigation data",
      control: { type: "object" },
    },
  },
};

export default meta;

const Template: StoryFn<{ state: Partial<IState> }> = (args) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const renderHomeContainer = () => {
    container.innerHTML = `<div class="workspace mt-4">
    <div id="nav">${createNavigationBar()}</div>
       ${renderCategories(args.state as IState)}
     <footer>Storybook footer</footer>
    </div>`;
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
    view: "categories",
    podcasts: podcasts,
  },
};
