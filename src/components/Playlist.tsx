import type React from "react";
import { useState } from "react";
import { PiStarFourFill } from "react-icons/pi";
import { useAppContext } from "../context/AppContext";
import StatCard from "./StatCard";
import moment from "moment";
import VideosList from "./VideosList";
import { TbLoader2 } from "react-icons/tb";

const Playlist: React.FC = () => {
  const { handleAnalyze, beautifyBigNumber, isLoading, playlistData, error } =
    useAppContext();
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div className="w-full">
      <h1 className="text-[#F7E9A8] text-3xl font-bold text-shadow">
        playlist
      </h1>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-3 lg:px-6 w-full space-y-3">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="text-[#a89bbd] size-3" />
          <p className="uppercase text-[#a89bbd] font-semibold font-sans text-sm">
            YouTube Playlist URL
          </p>
        </div>
        <div className="flex gap-5">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#101014] grow border-2 border-[#393642] rounded-sm py-2.5 px-4 focus:outline-2 focus:outline-offset-3 focus:outline-[#F7E9A8]"
            type="text"
            placeholder="Paste the URL of a YouTube Playlist..."
          />
          <button
            onClick={() => !!inputValue && handleAnalyze(inputValue)}
            className="bg-[#F7E9A8] text-black font-bold rounded-sm px-7 text-lg hover:opacity-70">
            Analyze
          </button>
        </div>
      </div>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-3 lg:px-6 w-full min-h-[50vh] flex flex-col">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="text-[#a89bbd] size-3" />
          <p className="uppercase text-[#a89bbd] font-semibold font-sans text-sm">
            Analysis
          </p>
        </div>
        {!playlistData && (
          <div className="flex-1 flex items-center justify-center gap-2 flex-col">
            {isLoading ? (
              <div className="opacity-40">
                <TbLoader2 className="animate-spin size-8" />
                <p>loading...</p>
              </div>
            ) : error.message ? (
              <div className="text-red-500 text-lg opacity-100">
                {error.message}
              </div>
            ) : (
              <div className="opacity-40">
                <p>No Data Available.</p>
                <p>Enter a YouTube Playlist URL to start analyzing.</p>
              </div>
            )}
          </div>
        )}
        {playlistData && (
          <div className="my-2">
            <p className="text-lg font-semibold">
              {playlistData.details.snippet.title}
            </p>
            {/* Stat cards */}
            <div className="my-4 grid grid-cols-3 gap-3">
              <StatCard
                title={"Total Videos"}
                value={beautifyBigNumber(
                  playlistData.details.contentDetails.itemCount,
                  "compact",
                )}
                tooltipValue={String(
                  playlistData.details.contentDetails.itemCount,
                )}
              />
              <StatCard
                title={"Published on"}
                value={moment(playlistData.details.snippet.publishedAt).format(
                  "DD MM YYYY",
                )}
                extra={moment(
                  playlistData.details.snippet.publishedAt,
                ).fromNow()}
              />
              <div className="border-2 border-[#29272B] rounded-md py-5 px-5 space-y-2 w-full shadow-[3px_3px_0px_0px_#29272B]">
                <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                  Channel
                </p>
                <a
                  href={`https://www.youtube.com/channel/${playlistData.details.snippet.channelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-blue-500 underline cursor-pointer">
                  {playlistData.details.snippet.channelTitle}
                </a>
              </div>
            </div>
            <div className="border-2 border-[#29272B] rounded-md px-3 py-5 overflow-hidden shadow-[3px_3px_0px_0px_#29272B]">
              <iframe
                src={`http://www.youtube.com/embed/videoseries?list=${playlistData.details.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title="YouTube video player"
                allowFullScreen
                className="w-full h-120 rounded-md"
              />
            </div>
            {/* Videos List */}
            <VideosList list={playlistData.items} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;

// https://youtube.com/playlist?list=PLjMdlvowxr_0IZ13u1fEZM7XEycYvIFTe&si=GprkhkI1EsG9-AE-
// https://www.youtube.com/playlist?list=PL8828Z-IEhFGrt2Tf1b0qg40g3AFw4YKp
