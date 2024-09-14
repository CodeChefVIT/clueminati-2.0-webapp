"use client";
import React, { FC } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </header>

      <Drawer>
        <DrawerTrigger asChild>
          <button className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white py-2 px-4 rounded-lg">
            Pull up Leaderboard
          </button>
        </DrawerTrigger>
        <DrawerContent className="fixed bottom-0 left-0 w-full bg-gray-800 h-[60vh] rounded-t-3xl p-4 transition-transform duration-500">
          <h2 className="text-center text-2xl text-white font-semibold mb-4">Leaderboard</h2>
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 max-h-[80%] overflow-y-auto">
            {teams.map((team) => (
              <div
                key={team.rank}
                className={`flex items-center justify-between py-3 mb-2 rounded-lg ${team.color} max-w-3xl mx-auto`}
              >
                <div className="flex items-center">
                  {/* Conditionally render icon for the 10th rank */}
                  {team.rank === 10 ? (
                    <img src={icons.chef} alt="chef" className="w-8 h-8 md:w-10 md:h-10 mr-4" />
                  ) : (
                    <span className="text-4xl font-bold text-black mr-4 md:text-5xl">{team.rank}</span>
                  )}
                  <div>
                    <div className="text-lg font-semibold text-poppins text-[#232530] md:text-2xl">
                      {team.name}
                    </div>
                    <div className="text-xs font-poppins text-[#232530] opacity-60 md:text-sm">
                      {team.tier}
                    </div>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl">
                  {/* Keep the silver icon for the 10th entry */}
                  <img src={icons[team.icon]} alt={team.icon} className="w-8 h-8 md:w-10 md:h-10" />
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Leaderboard;
