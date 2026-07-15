import type { IState, ParsedEpisode } from "../interfaces";

export function sortTrackList(state: IState, trackList: ParsedEpisode[]) {
  const { sortField = "title", ascOffset = 1 } = state;
  const sortedList: ParsedEpisode[] | undefined = [...trackList!]?.sort(
    (a, b) => {
      let aProp: any = a[sortField as keyof ParsedEpisode]!;
      let bProp: any = b[sortField as keyof ParsedEpisode]!;
      if (sortField === "pubDate") {
        aProp = new Date(aProp as string).getTime();
        bProp = new Date(bProp as string).getTime();
      }
      return aProp > bProp ? ascOffset * 1 : ascOffset * -1;
    }
  );
  return sortedList;
}
