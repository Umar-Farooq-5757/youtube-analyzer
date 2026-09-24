import type React from "react";
import { BsDiamond, BsDiamondFill } from "react-icons/bs";

interface SidebarProps {
  selected: string;
  setSelected: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, setSelected }) => {
  const sidebarItems = ["video", "channel", "playlist"];
  return (
    <div>
      <h1 className="text-[#F7E9A8] font-bold text-xl text-shadow">YouTube Analyzer</h1>
      <div className="mt-10 space-y-1">
        {sidebarItems.map((item) => {
          return (
            <div
              onClick={() => setSelected(item)}
              className={`flex items-center gap-3 font-semibold px-3 py-2.5 cursor-pointer rounded-sm hover:bg-[#1B1826] ${selected === item && "text-[#F7E9A8] bg-[#1B1826] border border-[#333235]"}`}>
              {selected === item ? (
                <BsDiamondFill className="size-3" />
              ) : (
                <BsDiamond className="size-3" />
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
ffsd fsdfsdfsdff f ffd fsd