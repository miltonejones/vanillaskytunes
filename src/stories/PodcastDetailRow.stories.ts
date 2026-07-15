import type { Meta, StoryFn } from "@storybook/html";
import type { ITrack, ParsedEpisode } from "../interfaces";
import { trackMemory } from "./data/trackMemory";
import { podcastDetailRow } from "../views/podcastDetail";
import { mockState } from "./data/state";

const meta: Meta<{
  currentTrack: ITrack;
  item: ParsedEpisode;
  expandedNodes?: any;
}> = {
  title: "Components/PodcastDetailRow",
  argTypes: {
    currentTrack: {
      description: "Track currently playing in the podcast detail view",
      control: { type: "object" },
    },
    item: {
      description: "Podcast episode item to display in the detail row",
      control: { type: "object" },
    },
    expandedNodes: {
      description: "State of expanded nodes in the podcast detail view",
      control: { type: "object" },
    },
  },
};

export default meta;

const Template: StoryFn<{
  currentTrack: ITrack;
  item: ParsedEpisode;
  expandedNodes?: any;
}> = (args) => {
  const container = document.createElement("div");
  container.className = "workspace mt-4";
  document.body.appendChild(container);

  localStorage.setItem("trackMemory", JSON.stringify(trackMemory));

  const renderPagination = () => {
    const trackMemory = JSON.parse(localStorage.getItem("trackMemory") || "{}");
    const isCurrentTrack = args.currentTrack?.guid === args.item.guid;
    const trackClass = isCurrentTrack ? "bg-primary text-white" : "";
    const safeItemData = JSON.stringify(args.item).replace(/'/g, "&apos;");
    const finished =
      trackMemory[args.item.guid] &&
      Number(trackMemory[args.item.guid].progress) > 98;
    const props = {
      isCurrentTrack,
      trackClass,
      safeItemData,
      finished,
      item: args.item,
      isExpanded: args.expandedNodes
        ? args.expandedNodes[args.item.guid]
        : false,
    };
    container.innerHTML = `
    
      <div class="list-group"> 
      ${podcastDetailRow(props)}
      </div>
    `;
  };
  renderPagination();
  return container;
};

export const Default = Template.bind({});
Default.args = {
  currentTrack: mockState.currentTrack,
  item: mockState.episodes[2],
  expandedNodes: {},
};

export const Active = Template.bind({});
Active.args = {
  currentTrack: mockState.currentTrack,
  item: mockState.episodes[0],
  expandedNodes: {},
};

export const Expanded = Template.bind({});
Expanded.args = {
  currentTrack: mockState.currentTrack,
  item: mockState.episodes[1],
  expandedNodes: {
    "https://justcast.herokuapp.com/shows/fbi/audioposts/638646.mp3": false,
    "https://justcast.herokuapp.com/shows/fbi/audioposts/638390.mp3": true,
  },
};
