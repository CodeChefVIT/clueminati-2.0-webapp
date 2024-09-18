"use client";

import myImage from "@/assets/images/boxes.svg";
import LeaderboardItem from "@/components/leaderboarditem";
import TeamInfo from "@/components/teaminfo";
import { type dashboardData } from "@/types/client/dashboard";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardProps {
  leaderboardData: dashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ leaderboardData }) => {
  const router = useRouter();
  return (
    <main className="mx-auto flex h-screen w-full max-w-[480px] flex-col items-center bg-white px-6 pt-12">
      <div className="flex w-full items-center justify-between">
        <div></div>
        <h1 className="text-3xl font-semibold text-black">Dashboard</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => void router.push("/profile")}
        >
          <UserIcon />
        </Button>
      </div>
      <TeamInfo data={leaderboardData} />

      <section className="mt-20 flex flex-col items-center text-zinc-800">
        <div className="grid w-full grid-cols-3">
          {leaderboardData.topTeams.slice(0, 3).map((item, index) => (
            <LeaderboardItem key={index} name={item.name} rank={index} />
          ))}
        </div>
        <Image
          loading="lazy"
          src={myImage as HTMLImageElement}
          alt="Team Image"
          className="w-[400px] shrink-0 object-contain"
        />
      </section>
    </main>
  );
};

export default Dashboard;
