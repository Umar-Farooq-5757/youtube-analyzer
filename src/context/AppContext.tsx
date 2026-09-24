import { createContext, useContext, useState, type ReactNode } from "react";
import { parseYouTubeUrl } from "../utils/youtube";
import { getVideoDetails } from "../services/youtube";

interface AppContextType {
  developer: string;
  selected: string;
  setSelected: (value: string) => void;
  data: any;
  setData: (value: any) => void;
  handleAnalyze: (value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [developer] = useState("umarfarooq");
  const [selected, setSelected] = useState<string>("video");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async (youtubeUrl: string) => {
    const { type, id } = parseYouTubeUrl(youtubeUrl);
    if (!id) {
      console.error("Invalid YouTube URL");
      return;
    }
    try {
      let result: any;
      if (type === "video") {
        result = await getVideoDetails(id);
        console.log({ type, details: result.items[0] });
        setData({ type, details: result.items[0] });
      }
    } catch (err: any) {
      console.error("Failed to fetch YouTube data");
    }
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
