"use client"; // Needed for client-side fetching with hooks

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
  id: number;
  name: string;
  score: number;
  imageUrl: string; // Local or external image
}

interface TeamInfoData {
  score: number;
  currentTier: string;
  pointsToNextTier: number;
  nextTier: string;
}

const Dashboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const [teamInfo, setTeamInfo] = useState<TeamInfoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/dashboard.json");
        const { topTeams, score, currentTier, nextTier, pointsToNextTier } = response.data.data;
        const mappedLeaderboardData = topTeams.map((team: any, index: number) => ({
          id: team.id,
          name: team.name,
          score: team.score,
          imageUrl: index === 0 ? green : index === 1 ? blue : orange,
        }));

        setLeaderboardData(mappedLeaderboardData);
        setTeamInfo({
          score,
          currentTier,
          nextTier,
          pointsToNextTier,
        });
      } catch (error) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="mx-auto flex w-full max-w-[480px] flex-col items-center overflow-hidden bg-white px-6 pb-64 pt-12">
      <h1 className="text-3xl font-bold text-black">Dashboard</h1>

      {teamInfo && <TeamInfo teamInfo={teamInfo} />} {/* TeamInfo component with dynamic data */}

      <section className="mt-20 flex flex-col items-center text-zinc-800">
        <div className="flex">
          {leaderboardData.map((item, index) => (
            <LeaderboardItem key={index} rank={index + 1} {...item} />
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
