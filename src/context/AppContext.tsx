import { createContext, useContext, useState, type ReactNode } from "react";
import { parseYouTubeUrl } from "../utils/youtube";
import {
  getChannelDetails,
  getChannelPlaylists,
  getEnhancedPlaylistData,
  getVideoDetails,
} from "../services/youtube";
import moment from "moment";

interface AppContextType {
  developer: string;
  selected: string;
  setSelected: (value: string) => void;
  videoData: any;
  setVideoData: (value: any) => void;
  channelData: any;
  setChannelData: (value: any) => void;
  playlistData: any;
  setPlaylistData: (value: any) => void;
  handleAnalyze: (value: string) => void;
  beautifyBigNumber: (
    countStr: string | number,
    displayNotation: "compact" | "engineering" | "scientific" | "standard",
  ) => string;
  getDurationForDifferentSpeeds: (isoDuration: string, speed: number) => string;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: {
    message: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [developer] = useState("umarfarooq");
  const [selected, setSelected] = useState<string>("playlist");
  const [videoData, setVideoData] = useState<any>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string }>({ message: "" });

  const handleAnalyze = async (youtubeUrl: string) => {
    const { type, id } = parseYouTubeUrl(youtubeUrl);
    if (!id) {
      console.error("Invalid YouTube URL");
      setError({ message: "Invalid YouTube URL" });
      return;
    }
    setIsLoading(true);
    try {
      if (type === "video") {
        setSelected("video");
        const videoResult = await getVideoDetails(id);
        setVideoData({
          type: "video",
          details: videoResult.items[0],
        });
      } else if (type === "playlist") {
        setSelected("playlist");
        const enhancedPlaylist = await getEnhancedPlaylistData(id);
        setPlaylistData({
          type: "playlist",
          details: enhancedPlaylist.details,
          items: enhancedPlaylist.items,
        });
      } else if (type === "channel") {
        setSelected("channel");
        const channelResult = await getChannelDetails(id);
        const channel = channelResult.items[0];
        if (!channel) {
          throw new Error("Channel not found");
        }
        const playlistsData = await getChannelPlaylists(channel.id);
        const keywordsRaw = channel.brandingSettings?.channel?.keywords || "";
        const channelKeywords = keywordsRaw
          ? keywordsRaw
              .match(/(?:[^\s"]+|"[^"]*")+/g)
              ?.map((k: string) => k.replace(/"/g, "")) || []
          : [];
        setChannelData({
          type: "channel",
          details: channel,
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
      setError({ message: "Failed to fetch YouTube data" });
    } finally {
      setIsLoading(false);
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
        videoData,
        setVideoData,
        channelData,
        setChannelData,
        playlistData,
        setPlaylistData,
        handleAnalyze,
        beautifyBigNumber,
        getDurationForDifferentSpeeds,
        isLoading,
        setIsLoading,
        error,
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
