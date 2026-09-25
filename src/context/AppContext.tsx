import { createContext, useContext, useState, type ReactNode } from "react";
import { parseYouTubeUrl } from "../utils/youtube";
import {
  getChannelDetails,
  getChannelPlaylists,
  getChannelUploads,
  getPlaylistDetails,
  getPlaylistVideos,
  getVideoDetails,
} from "../services/youtube";
import moment from "moment";

interface AppContextType {
  developer: string;
  selected: string;
  setSelected: (value: string) => void;
  data: any;
  setData: (value: any) => void;
  handleAnalyze: (value: string) => void;
  beautifyBigNumber: (
    countStr: string | number,
    displayNotation: "compact" | "engineering" | "scientific" | "standard",
  ) => string;
  getDurationForDifferentSpeeds: (isoDuration: string, speed: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [developer] = useState("umarfarooq");
  const [selected, setSelected] = useState<string>("playlist");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async (youtubeUrl: string) => {
    const { type, id } = parseYouTubeUrl(youtubeUrl);
    if (!id) {
      console.error("Invalid YouTube URL");
      return;
    }
    try {
      if (type === "video") {
        setSelected("video");
        const videoResult = await getVideoDetails(id);
        setData({
          type: "video",
          details: videoResult.items[0],
        });
      } else if (type === "playlist") {
        setSelected("playlist");

        const [playlistResult, playlistItemsResult] = await Promise.all([
          getPlaylistDetails(id),
          getPlaylistVideos(id),
        ]);
        console.log({
          type: "playlist",
          details: playlistResult.items[0],
          items: playlistItemsResult.items || [],
          nextPageToken: playlistItemsResult.nextPageToken || null,
        });
        setData({
          type: "playlist",
          details: playlistResult.items[0],
          items: playlistItemsResult.items || [],
          nextPageToken: playlistItemsResult.nextPageToken || null,
        });
      } else if (type === "channel") {
        setSelected("channel");

        const channelResult = await getChannelDetails(id);
        const channel = channelResult.items[0];

        if (!channel) {
          throw new Error("Channel not found");
        }

        const uploadsPlaylistId =
          channel.contentDetails?.relatedPlaylists?.uploads;

        const [playlistsData, uploadsData] = await Promise.all([
          getChannelPlaylists(channel.id),
          uploadsPlaylistId
            ? getChannelUploads(uploadsPlaylistId)
            : Promise.resolve({ items: [], nextPageToken: null }),
        ]);
        const keywordsRaw = channel.brandingSettings?.channel?.keywords || "";
        const channelKeywords = keywordsRaw
          ? keywordsRaw
              .match(/(?:[^\s"]+|"[^"]*")+/g)
              ?.map((k: string) => k.replace(/"/g, "")) || []
          : [];

        setData({
          type: "channel",
          details: channel,
          videos: uploadsData.items || [],
          videosNextPageToken: uploadsData.nextPageToken || null,
          uploadsPlaylistId: uploadsPlaylistId || null,
          playlists: playlistsData.items || [],
          totalPlaylists:
            playlistsData.pageInfo?.totalResults ||
            playlistsData.items?.length ||
            0,
          keywords: channelKeywords,
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch YouTube data:", err);
    }
  };

  const beautifyBigNumber = (
    countStr: string | number,
    displayNotation: "compact" | "engineering" | "scientific" | "standard",
  ): string => {
    const num = typeof countStr === "string" ? Number(countStr) : countStr;
    if (isNaN(num)) return "0";

    return new Intl.NumberFormat("en-US", {
      notation: displayNotation,
      maximumFractionDigits: 1,
    }).format(num);
  };

  const getDurationForDifferentSpeeds = (
    isoDuration: string,
    speed: number,
  ): string => {
    if (!isoDuration) return "00:00";

    const totalSeconds = moment.duration(isoDuration).asSeconds();
    const adjustedSeconds = Math.round(totalSeconds / speed);

    const dur = moment.duration(adjustedSeconds, "seconds");
    const hours = Math.floor(dur.asHours());
    const minutes = dur.minutes();
    const seconds = dur.seconds();

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <AppContext.Provider
      value={{
        developer,
        selected,
        setSelected,
        data,
        setData,
        handleAnalyze,
        beautifyBigNumber,
        getDurationForDifferentSpeeds,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};
