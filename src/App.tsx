import { useState } from "react";
import "./App.css";
import { parseYouTubeUrl } from "./utils/youtube";
import { getVideoDetails } from "./services/youtube";

const App = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async () => {
    const { type, id } = parseYouTubeUrl(inputValue);
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
    <>
      <h1>YouTube Analyzer</h1>
      <input
        type="text"
        placeholder="Enter a YouTube video, channel or playlist URL..."
        className="w-full"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAnalyze}>Submit</button>
      {data && (
        <div className="mt-20">
          <p>
            <span className="font-bold text-xl">Title: </span>
            <span>{data.details.snippet.title}</span>
          </p>
          <p>
            <span className="font-bold text-xl">Likes: </span>
            <span>{data.details.statistics.likeCount}</span>
          </p>
          <p>
            <span className="font-bold text-xl">Views: </span>
            <span>{data.details.statistics.viewCount}</span>
          </p>
          <p>
            <span className="font-bold text-xl">Comments: </span>
            <span>{data.details.statistics.commentCount}</span>
          </p>
        </div>
      )}
    </>
  );
};

export default App;
