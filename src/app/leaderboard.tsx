"use client";
import React, { FC, useState, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { icons } from "./icons";

interface Team {
  rank: number;
  name: string;
  tier: string;
  color: string;
  icon: keyof typeof icons;
}

const teams: Team[] = [
  { rank: 1, name: "Team Name", tier: "Diamond Tier", color: "custom-yellow", icon: "diamond" },
  { rank: 2, name: "Team Name", tier: "Diamond Tier", color: "custom-blue", icon: "diamond" },
  { rank: 3, name: "Team Name", tier: "Diamond Tier", color: "custom-green", icon: "diamond" },
  { rank: 4, name: "Team Name", tier: "Diamond Tier", color: "custom-orange", icon: "diamond" },
  { rank: 5, name: "Team Name", tier: "Diamond Tier", color: "custom-yellow", icon: "diamond" },
  { rank: 6, name: "Team Name", tier: "Diamond Tier", color: "custom-blue", icon: "diamond" },
  { rank: 7, name: "Team Name", tier: "Diamond Tier", color: "custom-green", icon: "diamond" },
  { rank: 8, name: "Team Name", tier: "Diamond Tier", color: "custom-orange", icon: "diamond" },
  { rank: 9, name: "Team Name", tier: "Diamond Tier", color: "custom-yellow", icon: "diamond" },
  { rank: 10, name: "Your Team Name", tier: "Silver Tier", color: "custom-blue", icon: "silver" },
];

const Leaderboard: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState(0);
  const [height, setHeight] = useState(0);

  // Only access window when rendering on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight);
    }
  }, []);

  const bind = useDrag(
    ({ movement: [, my], memo = position, direction: [, yDir], distance: [, yDist], last, touches }) => {
      if (last) {
        // If the distance of drag is greater than 50px, trigger expansion/collapse
        if (yDist > 50) {
          setIsExpanded(yDir < 0); // Swipe up expands, swipe down collapses
        }
        setPosition(0); // Reset position after swipe ends
      } else {
        setPosition(my + memo); // Track the movement while dragging
      }
      return memo;
    },
    { axis: "y", bounds: { top: -height / 2, bottom: 0 }, filterTaps: true } // Restrict drag area, filter taps
  );

  return (
    <div
      {...bind()}
      style={{
        transform: `translateY(${isExpanded ? "0" : "calc(100% - 50px)"})`,
        transition: "transform 0.5s ease-in-out",
        touchAction: "none", // Prevents the default touch action to better capture swipe gestures
      }}
      className="leaderboard-container"
    >
      <div className="p-4 text-center text-white">
        <h2>Swipe up to expand the leaderboard</h2>
      </div>
      {teams.map((team) => (
        <div
          key={team.rank}
          className={`flex items-center justify-between p-4 mb-2 rounded-lg ${team.color}`}
        >
          <div className="flex items-center">
            <span className="text-7xl font-bold text-black mr-4">{team.rank}</span>
            <div>
              <div className="text-3xl font-semibold font-poppins text-[#232530]">
                {team.name}
              </div>
              <div className="text-sm font-poppins text-[#232530] opacity-60">
                {team.tier}
              </div>
            </div>
          </div>
          <div className="text-4xl">
            <img src={icons[team.icon]} alt={team.icon} className="w-10 h-10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
