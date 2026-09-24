import type React from "react";
import { PiStarFourFill } from "react-icons/pi";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

const Video: React.FC = () => {
  const { handleAnalyze, data } = useAppContext();
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className="w-full">
      <h1 className="text-[#F7E9A8] text-3xl font-bold text-shadow">video</h1>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-6 w-full space-y-3">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="text-[#a89bbd] size-3" />
          <p className="uppercase text-[#a89bbd] font-semibold font-sans text-sm">
            YouTube Video URL
          </p>
        </div>
        <div className="flex gap-5">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#101014] grow border-2 border-[#393642] rounded-sm py-2.5 px-4 focus:outline-2 focus:outline-offset-3 focus:outline-[#F7E9A8]"
            type="text"
            placeholder="Paste the URL of a YouTube Video..."
          />
          <button
            onClick={() => handleAnalyze(inputValue)}
            className="bg-[#F7E9A8] text-black font-bold rounded-sm px-7 text-lg">
            Analyze
          </button>
        </div>
      </div>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-6 w-full">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="text-[#a89bbd] size-3" />
          <p className="uppercase text-[#a89bbd] font-semibold font-sans text-sm">
            Analysis
          </p>
        </div>
        {data && (
          <div>
            <p>{data.details.snippet.title}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;