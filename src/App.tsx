import { useState } from "react";
import "./App.css";
import { parseYouTubeUrl } from "./utils/youtube";
import { getVideoDetails } from "./services/youtube";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [selected, setSelected] = useState<string>("video");
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
    <main className="min-h-screen bg-[#101014] text-white flex">
      <div className="bg-[#13111A] w-[17%] border-r-2 border-[#29272B] py-5 px-6">
        <Sidebar selected={selected} setSelected={setSelected}/>
      </div>
      <section className="bg-[#101014] py-5 px-6">
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
      </section>
    </main>
  );
};

export default App;
