"use client"; // Required for client-side fetching

import React, { useEffect, useState } from "react";
import axios from "axios";
import blue from "@/assets/images/blue_icon.svg";
import myImage from "@/assets/images/boxes.svg";
import green from "@/assets/images/green_icon.svg";
import orange from "@/assets/images/orange_icon.svg";
import LeaderboardItem from "@/components/leaderboarditem";
import TeamInfo from "@/components/teaminfo";
import Image from "next/image";

interface LeaderboardData {
  rank: number;
  name: string;
  imageUrl: string; // URL of image
}

interface DashboardData {
  currentPoints: number;
  currentTier: string;
  currentRank: number;
  pointsToNextTier: number;
  nextTier: string;
}

const Dashboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const [teamInfo, setTeamInfo] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/dashboard"); // Replace with your backend API endpoint
        const { leaderboard, teamInfo } = response.data;

        setLeaderboardData(leaderboard); // Top 3 teams from backend
        setTeamInfo(teamInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col items-center overflow-hidden bg-white px-6 pb-64 pt-12">
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>

      {teamInfo && <TeamInfo teamInfo={teamInfo} />}

      <section className="mt-20 flex flex-col items-center text-zinc-800">
        <div className="flex">
          {leaderboardData.map((item, index) => (
            <LeaderboardItem key={index} {...item} />
          ))}
        </div>
        <div className="mt-6">
          <Image
            loading="lazy"
            src={myImage as HTMLImageElement}
            alt="Team Image"
            className="w-[400px] shrink-0 object-contain"
          />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
