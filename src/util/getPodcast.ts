const RSS_ENDPOINT =
  "https://ef9jmtk9rk.execute-api.us-east-1.amazonaws.com/json";

export const getPodcast = async (url: string) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  };

  const response = await fetch(RSS_ENDPOINT, requestOptions);
  try {
    const res = await response.text();
    return res;
  } catch (e) {
    console.log("setApplication error:", e);
    return false;
  }
};
