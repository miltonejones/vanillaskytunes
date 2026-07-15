// playlist.stories.ts
import type { Meta, StoryFn } from "@storybook/html";
import type { IState, ITrack, ParsedEpisode } from "../interfaces";
import { mockState } from "./data/state";
import { renderPlaylist } from "../views/playlist";

// Mock playlist episodes data
const mockPlaylistEpisodes = mockState.episodes.slice(0, 20) as ParsedEpisode[];

// Mock episodes with long titles for testing truncation
const mockEpisodesWithLongTitles: ParsedEpisode[] = mockPlaylistEpisodes.filter(
  (ep) => ep.title.length > 50
);

const meta: Meta = {
  title: "Components/Playlist",
  parameters: {
    layout: "padded",
  },
  argTypes: {
    trackList: { control: "object" },
    currentTrackGuid: { control: "text" },
    episodeCount: { control: "number" },
  },
};

export default meta;

// Template for our stories
const Template: StoryFn<{
  trackList: ParsedEpisode[];
  currentTrackGuid: string;
  propState: Partial<IState>;
}> = (args) => {
  const state: Partial<IState> = {
    ...args.propState,
    trackList: args.trackList,
    // currentTrack: args.currentTrackGuid
    //   ? args.trackList.find((ep) => ep.guid === args.currentTrackGuid)
    //   : undefined,
  };

  const container = document.createElement("div");
  container.innerHTML = renderPlaylist(state);
  container.style.width = "400px";
  container.style.height = "calc(100vh - 40px)";
  container.style.overflowX = "hidden";
  container.style.overflowY = "auto";

  return container; //renderPlaylist(state);
};

// Stories
export const Default = Template.bind({});
Default.args = {
  propState: mockState,
  trackList: mockPlaylistEpisodes,
  currentTrackGuid: "",
};
Default.parameters = {
  docs: {
    description: {
      story:
        "Default playlist view showing a list of episodes with titles and durations.",
    },
  },
};

export const WithCurrentTrack = Template.bind({});
WithCurrentTrack.args = {
  propState: {
    ...mockState,
    currentTrack: mockState.episodes[2] as unknown as ITrack,
  },
  trackList: mockPlaylistEpisodes,
  currentTrackGuid: "playlist-3",
};
WithCurrentTrack.parameters = {
  docs: {
    description: {
      story:
        "Playlist view highlighting the currently playing track with different background color and text color.",
    },
  },
};

export const EmptyPlaylist = Template.bind({});
EmptyPlaylist.args = {
  propState: mockState,
  trackList: [],
  currentTrackGuid: "",
};
EmptyPlaylist.parameters = {
  docs: {
    description: {
      story: "Playlist view when there are no episodes in the track list.",
    },
  },
};

export const SingleEpisode = Template.bind({});
SingleEpisode.args = {
  propState: mockState,
  trackList: [mockPlaylistEpisodes[0]],
  currentTrackGuid: "playlist-1",
};
SingleEpisode.parameters = {
  docs: {
    description: {
      story:
        "Playlist view with only one episode, showing the current track highlighted.",
    },
  },
};

export const LongTitles = Template.bind({});
LongTitles.args = {
  propState: mockState,
  trackList: mockEpisodesWithLongTitles,
  currentTrackGuid: "long-title-1",
};
LongTitles.parameters = {
  docs: {
    description: {
      story:
        "Playlist view demonstrating text truncation for episodes with very long titles.",
    },
  },
};
