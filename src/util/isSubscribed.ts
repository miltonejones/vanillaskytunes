import type { IPodcast, IState } from "../interfaces";

export const isSubscribed = (state: Partial<IState>, podcast: IPodcast) => {
  return state.subscriptions?.some((sub) => sub.feedUrl === podcast.feedUrl);
};
