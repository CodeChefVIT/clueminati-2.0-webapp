import React from 'react';
import TeamInfo from '@/components/teaminfo';
import ProgressBar from './progressbar';
import LeaderboardItem from '@/components/leaderboarditem';
import myImage from "@/assets/images/boxes.svg";
import green from "@/assets/images/green_icon.svg";
import blue from "@/assets/images/blue_icon.svg";
import orange from "@/assets/images/orange_icon.svg";
import Image from "next/image";
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const leaderboardData = [
    { rank: 2, name: 'Team Name', imageUrl: green },
    { rank: 1, name: 'Team Name', imageUrl: blue},
    { rank: 3, name: 'Team Name', imageUrl: orange},
  ];

  return (
    <main className="flex overflow-hidden flex-col items-center px-6 pt-12 pb-64 mx-auto w-full bg-white max-w-[480px]">
      <h1 className="text-3xl font-bold text-black" style={{ textAlign: 'center' }}>Dashboard</h1>
      <TeamInfo />
      
      <section className="flex flex-col items-center mt-20 text-zinc-800">
        <div className="flex">
          {leaderboardData.map((item, index) => (
            <LeaderboardItem key={index} {...item} />
          ))}
        </div>
        <div className="mt-6">
          <Image
            loading="lazy"
            src={myImage}
            alt="Team Image"
            className="object-contain shrink-0 w-[400px]"
          />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
