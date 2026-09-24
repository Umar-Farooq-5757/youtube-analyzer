import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { data, handleAnalyze } = useAppContext();
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <main className="min-h-screen bg-[#101014] text-white flex">
      <div className="bg-[#13111A] w-[17%] border-r-2 border-[#29272B] py-5 px-6">
        <Sidebar />
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
        <button onClick={() => handleAnalyze(inputValue)}>Submit</button>
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
