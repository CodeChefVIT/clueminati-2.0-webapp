import React from "react";
import Image from "next/image";
import { icons } from "@/assets/icons";

interface LeaderboardItemProps {
  name: string;
  rank: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ name, rank }) => {
  const rankPadding = rank === 1 ? "mt-2" : rank === 2 ? "mt-8 " : "mt-12 ";
  const bg: Record<number, string> = {
    0: "bg-customYellow",
    1: "bg-customGreen",
    2: "bg-customBlue",
  };

  return (
    <div className="col-span-1 flex flex-col items-center">
      <div className={`flex flex-col items-center self-center ${rankPadding}`}>
        <div className={`${bg[rank]} rounded-full p-1`}>
          <Image
            src={icons.chef}
            alt={`${name} avatar`}
            width={56}
            height={56}
            className="aspect-square w-14 object-contain"
          />
        </div>
        <p className="mt-1 text-center">{name}</p>
      </div>
    </div>
  );
};

export default LeaderboardItem;
