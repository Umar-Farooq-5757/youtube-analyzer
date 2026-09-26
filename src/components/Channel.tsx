import type React from "react";
import { useState } from "react";
import { PiStarFourFill } from "react-icons/pi";
import { useAppContext } from "../context/AppContext";
import StatCard from "./StatCard";
import moment from "moment";
import data from "../../structure/channelStructure.json";

const Channel: React.FC = () => {
  const { handleAnalyze, beautifyBigNumber } = useAppContext();
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className="w-full">
      <h1 className="text-[#F7E9A8] text-3xl font-bold text-shadow">channel</h1>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-6 w-full space-y-3">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="text-[#a89bbd] size-3" />
          <p className="uppercase text-[#a89bbd] font-semibold font-sans text-sm">
            YouTube Channel URL
          </p>
        </div>
        <div className="flex gap-5">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-[#101014] grow border-2 border-[#393642] rounded-sm py-2.5 px-4 focus:outline-2 focus:outline-offset-3 focus:outline-[#F7E9A8]"
            type="text"
            placeholder="Paste the URL of a YouTube Channel..."
          />
          <button
            onClick={() => !!inputValue && handleAnalyze(inputValue)}
            className="bg-[#F7E9A8] text-black font-bold rounded-sm px-7 text-lg hover:opacity-70">
            Analyze
          </button>
        </div>
      </div>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-6 w-full min-h-[50vh] flex flex-col">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="text-[#a89bbd] size-3" />
          <p className="uppercase text-[#a89bbd] font-semibold font-sans text-sm">
            Analysis
          </p>
        </div>
        {!data && (
          <div className="flex-1 flex items-center justify-center gap-2 flex-col opacity-40">
            <p>No Data Available.</p>
            <p>Enter a YouTube Channel URL to start analyzing.</p>
          </div>
        )}
        {data && (
          <div className="my-2 py-3">
            {/* Profile picture, and channel title */}
            <div className="space-y-3">
              <div className="flex gap-10">
                <img
                  className="rounded-full size-30"
                  src={data.details.snippet.thumbnails.high.url}
                  alt=""
                />
                <div className="space-y-2">
                  <h1 className="text-[#F7E9A8] text-3xl font-bold text-shadow">
                    {data.details.snippet.title}
                  </h1>
                  <p className="text-[#a89bbd] font-semibold font-sans text-[15px]">
                    {data.details.snippet.description}
                  </p>
                </div>
              </div>
            </div>
            {/* Stat cards */}
            <div className="my-4 grid grid-cols-3 gap-3">
              <StatCard
                title={"Subscribers"}
                value={beautifyBigNumber(
                  data.details.statistics.subscriberCount,
                  "compact",
                )}
                tooltipValue={data.details.statistics.subscriberCount}
              />
              <StatCard
                title={"Total Views"}
                value={beautifyBigNumber(
                  data.details.statistics.viewCount,
                  "compact",
                )}
                tooltipValue={data.details.statistics.viewCount}
              />
              <StatCard
                title={"Total Videos"}
                value={beautifyBigNumber(
                  data.details.statistics.videoCount,
                  "compact",
                )}
                tooltipValue={data.details.statistics.videoCount}
              />
            </div>
            {/* Stat cards */}
            <div className="my-4 grid grid-cols-3 gap-3">
              <StatCard
                title={"Created on"}
                value={moment(data.details.snippet.publishedAt).format(
                  "DD MM YYYY",
                )}
                extra={moment(data.details.snippet.publishedAt).fromNow()}
              />
              <StatCard
                title={"Country"}
                value={data.details.brandingSettings.channel.country}
              />
              <StatCard
                title={"Total Playlists"}
                value={String(data.playlists.length)}
              />
            </div>
            {/* Channel Keywords */}
            {data.keywords && (
              <div className="border-2 border-[#29272B] rounded-md py-5 px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
                <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                  Channel Keywords
                </p>
                <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
                <div className="flex flex-wrap space-x-3 space-y-1">
                  {data.keywords?.map((keyword: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[#101014] text-sm border-2 border-[#29272B] rounded-sm px-2 py-0.5">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Playlists */}
            <div className="border-2 border-[#29272B] rounded-md py-5 px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
              <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                Playlists
              </p>
              <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
              <div className="grid grid-cols-3 gap-3">
                {data.playlists.map((playlist: any) => (
                  <div
                    className="border-2 border-[#29272B] rounded-md py-3 px-3 space-y-2 w-full shadow-[3px_3px_0px_0px_#29272B]"
                    key={playlist.id}>
                    <img
                      className="w-full rounded-md"
                      src={playlist.snippet.thumbnails.high.url}
                      alt=""
                    />
                    <div className="flex justify-between items-start">
                      <p className="text-[15px]">{playlist.snippet.title}</p>
                      <div className="bg-[#101014] text-sm border-2 border-[#29272B] rounded-sm px-2 py-0.5">
                        {playlist.contentDetails.itemCount}
                      </div>
                    </div>
                    <a
                      href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-500 underline cursor-pointer">
                      View on youtube
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;

// https://www.youtube.com/@IMWaqasNasir
