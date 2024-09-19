"use client";

import myImage from "@/assets/images/boxes.svg";
import LeaderboardItem from "@/components/leaderboarditem";
import TeamInfo from "@/components/teaminfo";
import { type dashboardData } from "@/types/client/dashboard";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface DashboardProps {
  leaderboardData: dashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ leaderboardData }) => {
  const router = useRouter();
  return (
    <main className="mx-auto flex h-[90vh] max-h-screen w-full max-w-[480px] flex-col items-center justify-between bg-white px-6 pt-8">
      <div className="">
        <div className="flex w-full items-center justify-between">
          <div className="relative w-full">
            <h1 className="text-center text-3xl font-semibold text-black">
              Dashboard
            </h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => void router.push("/profile")}
              className="absolute right-0 top-0"
            >
              <UserIcon />
            </Button>
          </div>
        </div>
        <TeamInfo data={leaderboardData} />
      </div>
      <section className="my-auto flex flex-col items-center text-zinc-800">
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
