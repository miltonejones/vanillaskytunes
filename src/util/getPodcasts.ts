const API_ENDPOINT =
  "https://j54s3g482f.execute-api.us-east-1.amazonaws.com/search";

export const getPodcasts = async (term: string) => {
  const response = await fetch(`${API_ENDPOINT}?term=${term}`);
  return await response.json();
};
