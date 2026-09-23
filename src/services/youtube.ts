const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const fetchFromYouTube = async <T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> => {
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_YOUTUBE_API_KEY. Please set it in your .env.local file."
    );
  }

  const queryParams = new URLSearchParams({
    key: API_KEY,
    ...params,
  });
  const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error?.message || `Error ${response.status}: Failed to fetch YouTube data`
    );
  }
  return data as T;
};

export const getVideoDetails = async <T = any>(
  videoIds: string | string[]
): Promise<T> => {
  const ids = Array.isArray(videoIds) ? videoIds.join(",") : videoIds;
  return fetchFromYouTube<T>("videos", {
    part: "snippet,statistics,contentDetails",
    id: ids,
  });
};