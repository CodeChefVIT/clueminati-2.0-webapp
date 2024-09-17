"use client";
import React, { useState } from "react";
import Image from "next/image";
import { icons } from "../assets/icons";
import { Button } from "@/components/ui/button";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Drawer } from "vaul";

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

const Leaderboard: React.FC<LeaderboardProps> = ({ show, toggleLeaderboard }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Drawer.Root open={show} onOpenChange={toggleLeaderboard}>
      <Drawer.Trigger asChild>
        <Button className="hidden">Open Leaderboard</Button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Drawer.Content
          className={`fixed bottom-0 left-0 w-full transition-all duration-500 ease-in-out ${
            isFullScreen ? "h-screen" : "h-[60vh]"
          } bg-leaderboardBg z-50 rounded-t-3xl p-3`}
        >
          <div className="flex items-center justify-between p-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFullScreen}
              className="text-white"
            >
              {isFullScreen ? <ChevronDown /> : <ChevronUp />}
            </Button>
            <h2 className="text-2xl text-white font-semibold mx-auto">Leaderboard</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleLeaderboard}
              className="text-white"
            >
              <X />
            </Button>
          </div>

          <div
            className={`px-4 sm:px-8 md:px-10 lg:px-12 overflow-y-auto`} // Ensure proper padding and overflow
            style={{
              maxHeight: isFullScreen ? "calc(100vh - 80px)" : "calc(60vh - 80px)", // Adjust max-height based on full-screen and half-screen
              paddingBottom: isFullScreen ? "2rem" : "2rem", // Ensure padding for last entry visibility
            }}
          >
            {teams.map((team) => (
              <div
                key={team.rank}
                className={`flex items-center justify-between py-3 mb-2 rounded-lg ${team.color} max-w-3xl mx-auto`}
              >
                <div className="flex items-center">
                  {team.rank === 10 ? (
                    <Image
                      src={icons.chef}
                      alt="chef"
                      width={60}
                      height={60}
                      className="w-12 h-12 md:w-14 md:h-14 mr-3 ml-3"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-leaderboardBg mr-4 ml-4 md:text-5xl">
                      {team.rank}
                    </span>
                  )}
                  <div>
                    <div className="text-lg font-semibold text-poppins text-leaderboardBg md:text-2xl">
                      {team.name}
                    </div>
                    <div className="text-xs font-poppins text-leaderboardBg opacity-60 md:text-sm">
                      {team.tier}
                    </div>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl">
                  <Image
                    src={icons[team.icon]}
                    alt={team.icon}
                    width={60}
                    height={60}
                    className="w-12 h-12 md:w-14 md:h-14 mr-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Leaderboard;