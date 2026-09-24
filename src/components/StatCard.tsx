import type React from "react";

interface StatCardProps {
  title: string;
  value: string;
  extra?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, extra = "" }) => {
  return (
    <div className="border-2 border-[#29272B] rounded-md py-5 px-5 space-y-2 w-full shadow-[3px_3px_0px_0px_#29272B]">
      <p className="text-[#a89bbd] uppercase font-semibold text-sm">{title}</p>
      <p className="text-[#F7E9A8] text-3xl font-bold text-shadow">{value}</p>
      <p className="text-[#a89bbd] uppercase font-semibold text-sm">{extra}</p>
    </div>
  );
};

export default StatCard;
