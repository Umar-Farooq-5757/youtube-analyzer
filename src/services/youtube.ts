const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const fetchFromYouTube = async <T>(
  endpoint: string,
  params: Record<string, string>,
): Promise<T> => {
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_YOUTUBE_API_KEY. Please set it in your .env.local file.",
    );
  }

  const queryParams = new URLSearchParams({
    key: API_KEY,
    ...params,
  });
  const response = await fetch(
    `${BASE_URL}/${endpoint}?${queryParams.toString()}`,
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        `Error ${response.status}: Failed to fetch YouTube data`,
    );
  }
  return data as T;
};

export const getVideoDetails = async <T = any>(
  videoIds: string | string[],
): Promise<T> => {
  const ids = Array.isArray(videoIds) ? videoIds.join(",") : videoIds;
  return fetchFromYouTube<T>("videos", {
    part: "snippet,contentDetails,statistics,status,player,topicDetails,recordingDetails",
    id: ids,
  });
};

export const getPlaylistDetails = async <T = any>(
  playlistId: string,
): Promise<T> => {
  return fetchFromYouTube<T>("playlists", {
    part: "snippet,contentDetails,status,player,localizations",
    id: playlistId,
  });
};

export const getPlaylistVideos = async <T = any>(
  playlistId: string,
  pageToken: string = "",
): Promise<T> => {
  const params: Record<string, string> = {
    part: "snippet,contentDetails,status",
    playlistId,
    maxResults: "50",
  };
  if (pageToken) params.pageToken = pageToken;
  return fetchFromYouTube<T>("playlistItems", params);
};

export const getChannelDetails = async <T = any>(
  channelOrHandle: string,
): Promise<T> => {
  const isHandle = channelOrHandle.startsWith("@");
  const params: Record<string, string> = {
    part: "snippet,contentDetails,statistics,status,brandingSettings,topicDetails,localizations",
  };

  if (isHandle) {
    params.forHandle = channelOrHandle;
  } else {
    params.id = channelOrHandle;
  }

  return fetchFromYouTube<T>("channels", params);
};

export const getChannelPlaylists = async <T = any>(
  channelId: string,
): Promise<T> => {
  return fetchFromYouTube<T>("playlists", {
    part: "snippet,contentDetails,status,player,localizations",
    channelId,
    maxResults: "50",
  });
};

export const getAllPlaylistVideos = async <T = any>(
  playlistId: string,
): Promise<T[]> => {
  let allItems: any[] = [];
  let nextPageToken: string | undefined = "";
  do {
    const response: any = await getPlaylistVideos(playlistId, nextPageToken);
    if (response.items) {
      allItems = allItems.concat(response.items);
    }
    nextPageToken = response.nextPageToken;
  } while (nextPageToken);

  return allItems;
};

export const getEnhancedPlaylistData = async (playlistId: string) => {
  const [playlistResult, rawPlaylistItems] = await Promise.all([
    getPlaylistDetails(playlistId),
    getAllPlaylistVideos(playlistId),
  ]);

  const playlistDetails = playlistResult.items?.[0];
  if (!playlistDetails) {
    throw new Error("Playlist not found");
  }

  if (rawPlaylistItems.length === 0) {
    return {
      details: playlistDetails,
      items: [],
    };
  }
  const videoIds = rawPlaylistItems
    .map((item: any) => item.contentDetails?.videoId)
    .filter(Boolean);
  const chunkedVideoIds = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunkedVideoIds.push(videoIds.slice(i, i + 50));
  }

  const videoDetailsPromises = chunkedVideoIds.map((ids) =>
    getVideoDetails(ids)
  );
  const videoDetailsResults = await Promise.all(videoDetailsPromises);
  const videoStatsMap = new Map();
  videoDetailsResults.forEach((result: any) => {
    result.items?.forEach((video: any) => {
      videoStatsMap.set(video.id, {
        statistics: video.statistics,
        contentDetails: video.contentDetails,
        status: video.status,
      });
    });
  });

  const enhancedItems = rawPlaylistItems.map((item: any) => {
    const videoId = item.contentDetails?.videoId;
    const statsData = videoStatsMap.get(videoId) || {};

    return {
      ...item,
      statistics: statsData.statistics || {},
      contentDetails: {
        ...item.contentDetails,
        ...statsData.contentDetails,
      },
    };
  });

  return {
    details: playlistDetails,
    items: enhancedItems,
  };
};