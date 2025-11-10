import type { PaginationResult, ParsedEpisode } from "../interfaces";

export const usePagination = (
  collection: ParsedEpisode[] | undefined = [],
  options: { page?: number; pageSize: number; sortkey?: string }
): PaginationResult => {
  const { page = 1, pageSize } = options;
  const pageCount = Math.ceil(collection.length / pageSize);
  const startNum = (page - 1) * pageSize;

  const visible = collection.slice(startNum, startNum + pageSize);

  return {
    startNum,
    pageCount,
    visible,
  };
};
