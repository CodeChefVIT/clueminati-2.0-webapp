"use client";

import myImage from "@/assets/images/boxes.svg";
import LeaderboardItem from "@/components/leaderboarditem";
import TeamInfo from "@/components/teaminfo";
import { type dashboardData } from "@/types/client/dashboard";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import CountdownTimer from "./timer";

interface DashboardProps {
  leaderboardData: dashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ leaderboardData }) => {
  const router = useRouter();
  return (
    <main className="mx-auto flex h-screen max-h-screen w-full max-w-[480px] flex-col items-center justify-between bg-white px-6 pt-8">
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

      <div className="mt-6 w-full rounded-lg bg-customBlue">
        {leaderboardData.station ? (
          <p className="py-2 text-center text-lg font-semibold text-black">
            Station: {leaderboardData.station}
          </p>
        ) : (
          <p className="py-2 text-center text-lg font-semibold text-black">
            <CountdownTimer targetDateTime={new Date("2024-09-20T07:30:00")} />
          </p>
        )}
      </div>

      <section className="mb-auto mt-10 flex flex-col items-center text-zinc-800">
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
