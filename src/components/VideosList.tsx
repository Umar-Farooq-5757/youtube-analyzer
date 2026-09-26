import type React from "react";
import { FaRegEye } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { BiLike } from "react-icons/bi";
import moment from "moment";
import { useState } from "react";

interface VideosListProps {
  list: any[];
}

const VideosList: React.FC<VideosListProps> = ({ list }) => {
  const { beautifyBigNumber, getDurationForDifferentSpeeds } = useAppContext();
  const [videosData, setVideosData] = useState(list);
  const [value, setValue] = useState<
    "views" | "likes" | "" | "duration" | "title" | "publishedAt" | "position"
  >("position");
  const [order, setOrder] = useState<"ascending" | "descending">("ascending");

  const sortVideos = (
    criteria: string,
    sortOrder: string,
    currentData: any[],
  ) => {
    if (!criteria) return currentData;

    const sortedList = [...currentData];
    const modifier = sortOrder === "ascending" ? 1 : -1;

    sortedList.sort((a, b) => {
      if (criteria === "views") {
        return (
          (Number(a.statistics?.viewCount || 0) -
            Number(b.statistics?.viewCount || 0)) *
          modifier
        );
      } else if (criteria === "likes") {
        return (
          (Number(a.statistics?.likeCount || 0) -
            Number(b.statistics?.likeCount || 0)) *
          modifier
        );
      } else if (criteria === "title") {
        return a.snippet.title.localeCompare(b.snippet.title) * modifier;
      } else if (criteria === "publishedAt") {
        return (
          (new Date(a.snippet.publishedAt).getTime() -
            new Date(b.snippet.publishedAt).getTime()) *
          modifier
        );
      } else if (criteria === "position") {
        return (
          ((a.snippet.position ?? 0) - (b.snippet.position ?? 0)) * modifier
        );
      } else if (criteria === "duration") {
        const getDurationInSeconds = (durationStr?: string) => {
          if (!durationStr) return 0;
          const match = durationStr.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
          if (!match) return 0;
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          const seconds = parseInt(match[3]) || 0;
          return hours * 3600 + minutes * 60 + seconds;
        };
        return (
          (getDurationInSeconds(a.contentDetails?.duration) -
            getDurationInSeconds(b.contentDetails?.duration)) *
          modifier
        );
      }
      return 0;
    });

    return sortedList;
  };

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCriteria = e.target.value as any;
    setValue(selectedCriteria);
    setVideosData(sortVideos(selectedCriteria, order, videosData));
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrder = e.target.value as any;
    setOrder(selectedOrder);
    setVideosData(sortVideos(value, selectedOrder, videosData));
  };

  return (
    <div className="border-2 border-[#29272B] rounded-md py-5 px-3 lg:px-5 shadow-[3px_3px_0px_0px_#29272B] my-4">
      <div className="flex items-center justify-between pr-10 flex-wrap">
        <p className="text-[#a89bbd] uppercase font-semibold text-sm">
          All Videos
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[#a89bbd] uppercase font-semibold text-sm">
            Sort by:
          </p>
          <select
            onChange={handleCriteriaChange}
            className="bg-[#101014] border-2 border-[#29272B] focus:outline-2 focus:outline-offset-1 focus:outline-[#F7E9A8] rounded-md shadow-[3px_3px_0px_0px_#29272B] px-3 py-1"
            value={value}>
            <option value="" disabled>
              Select option
            </option>
            <option value="position">Position in Playlist</option>
            <option value="views">Views</option>
            <option value="likes">Likes</option>
            <option value="duration">Duration</option>
            <option value="title">Title</option>
            <option value="publishedAt">Published at</option>
          </select>
          <select
            onChange={handleOrderChange}
            className="bg-[#101014] border-2 border-[#29272B] focus:outline-2 focus:outline-offset-1 focus:outline-[#F7E9A8] rounded-md shadow-[3px_3px_0px_0px_#29272B] px-3 py-1"
            value={order}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>
      <div className="h-0.5 w-full bg-[#29282b] my-3"></div>
      <div className="flex flex-col gap-3">
        {videosData.map((item: any) => {
          const thumbnail =
            item.snippet?.thumbnails?.default?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.standard?.url ||
            item.snippet?.thumbnails?.maxres?.url;

          return (
            <div
              className="bg-[#101014] flex items-center justify-between gap-10 border-2 border-[#29272B] rounded-md px-6 py-3 shadow-[3px_3px_0px_0px_#29272B]"
              key={item.id}>
              <div className="flex items-center gap-5">
                <img src={thumbnail} alt={item.snippet.title} />
                <div className="max-w-2/3">
                  <p className="text-sm">{item.snippet.title}</p>
                  <p className="text-sm">
                    <span>{item.snippet.position + 1}</span>
                    <span> | </span>
                    <span className="text-[#a89bbd] font-semibold">
                      {moment(item.snippet.publishedAt).format("DD MM YYYY")}
                    </span>
                  </p>
                  <p className="text-sm text-[#a89bbd] font-semibold">
                    <span>Duration: </span>
                    <span>
                      {getDurationForDifferentSpeeds(
                        item.contentDetails?.duration,
                        1,
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <div className="space-y-1">
                <p title="views" className="flex items-center gap-2">
                  <FaRegEye />
                  {beautifyBigNumber(item.statistics?.viewCount, "compact")}
                </p>
                <p title="likes" className="flex items-center gap-2">
                  <BiLike />
                  {beautifyBigNumber(item.statistics?.likeCount, "compact")}
                </p>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-blue-500 underline cursor-pointer">
                  Analyze
                </p>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideosList;