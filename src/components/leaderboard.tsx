"use client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Drawer } from "vaul";
import { icons } from "../assets/icons";
import { type dashboardData } from "@/types/client/dashboard";

const colors = [
  "bg-customYellow",
  "bg-customBlue",
  "bg-customGreen",
  "bg-customOrange",
];

interface LeaderboardProps {
  show: boolean;
  toggleLeaderboard: () => void;
  leaderboardData: dashboardData;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  show,
  toggleLeaderboard,
  leaderboardData,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Drawer.Root open={show} onOpenChange={toggleLeaderboard}>
      {/* <Drawer.Trigger asChild>
        <Button className="hidden">Open Leaderboard</Button>
      </Drawer.Trigger> */}

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black bg-opacity-50" />

        <Drawer.Content
          className={`fixed bottom-0 left-0 w-full transition-all duration-500 ease-in-out ${
            isFullScreen ? "h-screen" : "h-[60vh]"
          } z-50 rounded-t-3xl bg-leaderboardBg p-3`}
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

            <h2 className="mx-auto text-2xl font-semibold text-white">
              Leaderboard
            </h2>

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
            className={`overflow-y-auto px-4 sm:px-8 md:px-10 lg:px-12`}
            style={{
              maxHeight: isFullScreen
                ? "calc(100vh - 80px)"
                : "calc(60vh - 80px)",
              paddingBottom: isFullScreen ? "2rem" : "2rem",
            }}
          >
            {leaderboardData.topTeams.map((team, i) => (
              <div
                key={i}
                className={`mb-2 flex items-center justify-between rounded-lg py-3 ${colors[i % 4]} mx-auto max-w-3xl`}
              >
                <div className="flex items-center">
                  {i === 9 ? (
                    <Image
                      src={icons.chef}
                      alt="chef"
                      width={60}
                      height={60}
                      className="ml-3 mr-3 h-12 w-12 md:h-14 md:w-14"
                    />
                  ) : (
                    <span className="ml-4 mr-4 text-4xl font-semibold text-leaderboardBg md:text-5xl">
                      {i + 1}
                    </span>
                  )}

                  <div>
                    <div className="text-poppins text-lg font-semibold text-leaderboardBg md:text-2xl">
                      {team.name}
                    </div>

                    <div className="font-poppins text-xs text-leaderboardBg opacity-60 md:text-sm">
                      {i === 9
                        ? `${leaderboardData.currentTier.charAt(0).toUpperCase()}${leaderboardData.currentTier.substring(1)}`
                        : "Diamond"}
                    </div>
                  </div>
                </div>

                <div className="text-3xl md:text-4xl">
                  <Image
                    src={
                      i === 9
                        ? icons[leaderboardData.currentTier]
                        : icons.diamond
                    }
                    alt=""
                    width={60}
                    height={60}
                    className="mr-3 h-12 w-12 md:h-14 md:w-14"
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
