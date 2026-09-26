import type React from "react";
import { BsDiamond, BsDiamondFill } from "react-icons/bs";
import { useAppContext } from "../context/AppContext";

const Sidebar: React.FC = () => {
  const { selected, setSelected } = useAppContext();
  const sidebarItems = ["video", "channel", "playlist"];

  return (
    <div>
      <h1 className="text-[#F7E9A8] font-bold text-xl text-shadow">
        YouTube Analyzer
      </h1>
      <div className="mt-10 space-y-1">
        {sidebarItems.map((item) => {
          return (
            <div
              key={item}
              onClick={() => setSelected(item)}
              className={`flex items-center gap-3 font-semibold px-3 py-2.5 cursor-pointer rounded-sm hover:bg-[#1B1826] border ${
                selected === item
                  ? "text-[#F7E9A8] bg-[#1B1826] border-[#333235]"
                  : "border-[#13111A]"
              }`}>
              {selected === item ? (
                <BsDiamondFill className="size-2" />
              ) : (
                <BsDiamond className="size-2" />
              )}
              <span>{item}</span>
            </div>
          );
        })} 
      </div>
    </div>
  );
};

export default Sidebar;