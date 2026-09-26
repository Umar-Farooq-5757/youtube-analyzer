import type React from "react";
import { PiStarFourFill } from "react-icons/pi";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import StatCard from "./StatCard";
import moment from "moment";
import { TbLoader2 } from "react-icons/tb";

const Video: React.FC = () => {
  const {
    handleAnalyze,
    beautifyBigNumber,
    getDurationForDifferentSpeeds,
    videoData,
    isLoading,
    error,
  } = useAppContext();
  const [inputValue, setInputValue] = useState<string>("");

  const differentSpeeds = [
    { label: "1.0x (Normal)", speed: 1.0 },
    { label: "1.25x Speed", speed: 1.25 },
    { label: "1.5x Speed", speed: 1.5 },
    { label: "2.0x Speed", speed: 2.0 },
  ];

  return (
    <div className="w-full">
      <h1 className="text-[#F7E9A8] text-3xl font-bold text-shadow">video</h1>
      <div className="bg-[#13111A] rounded-sm border-2 border-[#393642] my-7 py-7 px-3 lg:px-6 w-full space-y-3">
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
        {!videoData && (
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
                <p>Enter a YouTube Video URL to start analyzing.</p>
              </div>
            )}
          </div>
        )}
        {videoData && (
          <div className="my-2">
            <p className="text-lg font-semibold">
              {videoData.details.snippet.title}
            </p>
            {/* Stat cards */}
            <div className="my-4 grid grid-cols-3 gap-3">
              <StatCard
                title={"Views"}
                value={beautifyBigNumber(
                  videoData.details.statistics.viewCount,
                  "compact",
                )}
                tooltipValue={videoData.details.statistics.viewCount}
              />
              <StatCard
                title={"Likes"}
                value={beautifyBigNumber(
                  videoData.details.statistics.likeCount,
                  "compact",
                )}
                tooltipValue={videoData.details.statistics.likeCount}
              />
              <StatCard
                title={"Comments"}
                value={beautifyBigNumber(
                  videoData.details.statistics.commentCount,
                  "compact",
                )}
                tooltipValue={videoData.details.statistics.commentCount}
              />
            </div>
            <div className="border-2 border-[#29272B] rounded-md px-3 py-5 overflow-hidden shadow-[3px_3px_0px_0px_#29272B]">
              <iframe
                src={`https://www.youtube.com/embed/${videoData.details.id}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-120 rounded-md"
              />
            </div>
            {/* Stat cards */}
            <div className="my-4 grid grid-cols-3 gap-3">
              <StatCard
                title={"Duration"}
                value={getDurationForDifferentSpeeds(
                  videoData.details.contentDetails.duration,
                  1,
                )}
              />
              <StatCard
                title={"Published on"}
                value={moment(videoData.details.snippet.publishedAt).format(
                  "DD MM YYYY",
                )}
                extra={moment(videoData.details.snippet.publishedAt).fromNow()}
              />
              <div className="border-2 border-[#29272B] rounded-md py-5 px-5 space-y-2 w-full shadow-[3px_3px_0px_0px_#29272B]">
                <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                  Channel
                </p>
                <a
                  href={`https://www.youtube.com/channel/${videoData.details.snippet.channelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-blue-500 underline cursor-pointer">
                  {videoData.details.snippet.channelTitle}
                </a>
              </div>
            </div>
            {/* Video Durations at Different Speeds */}
            <div className="border-2 border-[#29272B] rounded-md py-5 px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
              <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                Watch Time at Different Speeds
              </p>
              <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
              <div className="grid grid-cols-4 gap-3">
                {differentSpeeds.map(({ label, speed }) => (
                  <div
                    key={speed}
                    className="border-2 border-[#393642] p-3 rounded-md text-center shadow-[3px_3px_0px_0px_#29272B]">
                    <span className="text-[#a89bbd] text-xs font-semibold block uppercase">
                      {label}
                    </span>
                    <span className="text-[#F7E9A8] font-bold text-lg mt-1 small-text-shadow">
                      {getDurationForDifferentSpeeds(
                        videoData.details.contentDetails.duration,
                        speed,
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Thumbnail */}
            <div className="border-2 border-[#29272B] rounded-md py-5 px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
              <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                Thumbnail
              </p>
              <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
              <div className="flex flex-wrap space-x-3 space-y-1">
                <img
                  className="rounded-md mx-auto"
                  src={videoData.details.snippet.thumbnails.high.url}
                  alt=""
                />
              </div>
            </div>
            {/* Description */}
            <div className="border-2 border-[#29272B] rounded-md py-5 px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
              <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                Description
              </p>
              <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
              <p className="whitespace-pre-line">
                {videoData.details.snippet.description}
              </p>
            </div>
            {/* Tags */}
            {videoData.details.snippet.tags && (
              <div className="border-2 border-[#29272B] rounded-md py-5 px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
                <p className="text-[#a89bbd] uppercase font-semibold text-sm">
                  Tags
                </p>
                <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
                <div className="flex flex-wrap space-x-3 space-y-1">
                  {videoData.details.snippet.tags?.map(
                    (tag: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[#101014] text-sm border-2 border-[#29272B] rounded-sm px-2 py-0.5">
                        {tag}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;

// https://youtu.be/DgyaAKMsDBk?si=DzJdHol6scXnOAiV
