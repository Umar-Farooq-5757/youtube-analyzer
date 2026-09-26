import type React from "react";
import { FaRegEye } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import { BiLike } from "react-icons/bi";
import moment from "moment";

interface VideosListProps {
  list: any;
}

const VideosList: React.FC<VideosListProps> = ({ list }) => {
  const { beautifyBigNumber, getDurationForDifferentSpeeds } = useAppContext();
  return (
    <div className="flex flex-col gap-3">
      {list.map((item: any) => {
        return (
          <div
            className="bg-[#101014] flex items-center gap-4 border-2 border-[#29272B] rounded-md px-3 py-3 shadow-[3px_3px_0px_0px_#29272B]"
            key={item.id}>
            <img src={item.snippet.thumbnails.default.url} alt="" />
            <div className="max-w-1/3">
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
                    item.contentDetails.duration,
                    1,
                  )}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <FaRegEye />
                {beautifyBigNumber(item.statistics.viewCount, "compact")}
              </p>
              <p className="flex items-center gap-2">
                <BiLike />
                {beautifyBigNumber(item.statistics.likeCount, "compact")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideosList;
