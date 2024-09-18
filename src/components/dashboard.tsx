import blue from "@/assets/images/blue_icon.svg";
import myImage from "@/assets/images/boxes.svg";
import green from "@/assets/images/green_icon.svg";
import orange from "@/assets/images/orange_icon.svg";
import LeaderboardItem from "@/components/leaderboarditem";
import TeamInfo from "@/components/teaminfo";
import Image from "next/image";

const Dashboard = () => {
  const leaderboardData = [
    { rank: 2, name: "Team Name", imageUrl: green as HTMLImageElement },
    { rank: 1, name: "Team Name", imageUrl: blue as HTMLImageElement },
    { rank: 3, name: "Team Name", imageUrl: orange as HTMLImageElement },
  ];

  return (
    <main className="mx-auto flex h-screen w-full max-w-[480px] flex-col items-center bg-white px-6 pt-12">
      <h1 className="text-3xl font-semibold text-black">Dashboard</h1>
      <TeamInfo />

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
