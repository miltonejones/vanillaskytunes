import type { Meta, StoryFn } from "@storybook/html";
import type { IState } from "../interfaces";
import { subscriptions } from "./data/subscriptions";
import { renderSubscriptions } from "../views";

const meta: Meta<{ state: Partial<IState>; limit: boolean }> = {
  title: "Components/Subscriptions",
  argTypes: {
    state: {
      description:
        "Application state containing current view and navigation data",
      control: { type: "object" },
    },
    limit: {
      description:
        "Whether to limit the number of displayed subscriptions (for dashboard view)",
      control: { type: "boolean" },
    },
  },
};

export default meta;

const Template: StoryFn<{ state: Partial<IState>; limit?: boolean }> = (
  args
) => {
  const container = document.createElement("div");
  container.innerHTML = `<div class="container mt-4">
     ${renderSubscriptions(args.state as IState, args.limit)}
  </div>`;

  return container;
};

export const Default = Template.bind({});
Default.args = {
  state: {
    view: "dash",
    subscriptions: subscriptions,
  },
  limit: true,
};

export const Unlimited = Template.bind({});
Unlimited.args = {
  state: {
    ...Default.args.state,
  },
};
