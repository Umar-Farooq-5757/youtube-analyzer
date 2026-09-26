import type React from "react";
import { useAppContext } from "../context/AppContext";
import { BsDiamond, BsDiamondFill } from "react-icons/bs";

const Footer: React.FC = () => {
  const { selected, setSelected } = useAppContext();
  const sidebarItems = ["video", "channel", "playlist"];

  return (
    <div className="flex items-center justify-around cursor-pointer">
      {sidebarItems.map((item) => {
        return (
          <div
            className={`flex flex-col items-center gap-1 ${selected === item ? "text-[#F7E9A8]" : "text-[#a89bbd]"}`}
            key={item}
            onClick={() => setSelected(item)}>
            {selected === item ? (
              <BsDiamondFill className="size-2" />
            ) : (
              <BsDiamond className="size-2" />
            )}
            <span className="text-sm">{item}</span>
          </div>
        );
      })}
    </div>
  );
};
export default Footer;
