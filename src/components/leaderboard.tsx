"use client";
import React, { FC } from "react";
import Image from "next/image";
import { icons } from "../assets/icons";
import { Button } from "@/components/ui/button"
import { X } from "lucide-react";

interface Team {
  rank: number;
  name: string;
  tier: string;
  color: string;
  icon: keyof typeof icons;
}

const teams: Team[] = [
  { rank: 1, name: "Team Name", tier: "Diamond Tier", color: "bg-customYellow", icon: "diamond" },
  { rank: 2, name: "Team Name", tier: "Diamond Tier", color: "bg-customBlue", icon: "diamond" },
  { rank: 3, name: "Team Name", tier: "Diamond Tier", color: "bg-customGreen", icon: "diamond" },
  { rank: 4, name: "Team Name", tier: "Diamond Tier", color: "bg-customOrange", icon: "diamond" },
  { rank: 5, name: "Team Name", tier: "Diamond Tier", color: "bg-customYellow", icon: "diamond" },
  { rank: 6, name: "Team Name", tier: "Diamond Tier", color: "bg-customBlue", icon: "diamond" },
  { rank: 7, name: "Team Name", tier: "Diamond Tier", color: "bg-customGreen", icon: "diamond" },
  { rank: 8, name: "Team Name", tier: "Diamond Tier", color: "bg-customOrange", icon: "diamond" },
  { rank: 9, name: "Team Name", tier: "Diamond Tier", color: "bg-customYellow", icon: "diamond" },
  { rank: 10, name: "Your Team Name", tier: "Silver Tier", color: "bg-customBlue", icon: "silver" },
];

interface LeaderboardProps {
  show: boolean;
  toggleLeaderboard: () => void;
}

const Leaderboard: FC<LeaderboardProps> = ({ show, toggleLeaderboard }) => {
  return (
    <>{show && (<div className="fixed inset-0 z-40 bg-leaderboardBg bg-opacity-50" onClick={toggleLeaderboard}></div>)}
      <div
        className={`fixed bottom-0 left-0 w-full h-[60vh] bg-leaderboardBg z-50 transform transition-transform duration-500 ease-in-out ${
          show ? "translate-y-0" : "translate-y-full"
        } rounded-t-3xl p-3`}>
        
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl text-white font-semibold">Leaderboard</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleLeaderboard}
            className="text-white">
            <X />
          </Button>

        </div>
        
        <div className="px-4 sm:px-8 md:px-10 lg:px-12 max-h-[75%] overflow-y-auto">
          {teams.map((team) => (
            <div key={team.rank} className={`flex items-center justify-between py-3 mb-2 rounded-lg 
            ${team.color} max-w-3xl mx-auto`}>

              <div className="flex items-center">
                {team.rank === 10 ? (
                 <Image src={icons.chef} alt="chef" width={60} height={60} className="w-12 h-12 md:w-14 md:h-14 mr-3 ml-3" />
                ) : (
                  <span className="text-4xl font-bold text-black mr-4 ml-4 md:text-5xl">{team.rank}</span>
                )}
                
                <div>
                  <div className="text-lg font-semibold text-poppins text-[bg-leaderboardBg] md:text-2xl">
                    {team.name}
                  </div>
                  
                  <div className="text-xs font-poppins text-[bg-leaderboardBg] opacity-60 md:text-sm">
                    {team.tier}
                  </div>
                </div>
              </div>
              
              <div className="text-3xl md:text-4xl">
                <Image src={icons[team.icon]} alt={team.icon} width={60} height={60} className="w-12 h-12 md:w-14 md:h-14 mr-3"/>
              </div>
            
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
