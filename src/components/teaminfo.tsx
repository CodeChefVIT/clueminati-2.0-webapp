import { icons } from "@/assets/icons";
import icon1 from "@/assets/images/ico1.svg";
import { Progress } from "@/components/ui/progress";
import { type dashboardData } from "@/types/client/dashboard";
import Image from "next/image";

interface TeamInfoProps {
  data: dashboardData;
}

const TeamInfo: React.FC<TeamInfoProps> = ({ data }) => {
  return (
    <section className="mt-3 flex w-full flex-col self-stretch rounded-2xl bg-customYellow pb-2.5">
      <div className="flex self-start text-base font-medium">
        <Image
          src={icons[data.currentTier]}
          alt="Team avatar"
          height={1000}
          width={1000}
          className="aspect-square w-[130px] shrink-0 object-contain shadow-[0px_1px_24px_rgba(216,229,237,0.18)]"
        />
        <div className="my-auto flex flex-col items-start">
          <h2 className="self-stretch text-xl font-semibold text-black">
            {data.name}
          </h2>
          <p className="text-black">{data.score} Points</p>
          <p className="mt-1 text-xs text-zinc-600">
            {`${data.currentTier.charAt(0).toUpperCase()}${data.currentTier.substring(1)}`}{" "}
            Tier
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col px-3">
        <Progress
          value={data.score / (data.score + data.pointsToNextTier)}
          className="h-2"
        />
        {
          <div className="mt-2.5 flex w-full justify-between text-xs font-medium text-zinc-800">
            <div className="flex items-center gap-2">
              <Image
                src={icon1 as HTMLImageElement}
                alt=""
                height={1000}
                width={1000}
                className="aspect-square w-[40px] shrink-0 object-contain sm:w-[61px]"
              />
              <p>
                {data.nextTier
                  ? `Minimum requirement for ${data.nextTier} tier currently is ${data.pointsToNextTier} points`
                  : "Congratulations! You have reached the highest tier."}
              </p>
            </div>
            {data.nextTier && (
              <Image
                src={icons[data.nextTier]}
                alt=""
                height={1000}
                width={1000}
                className="aspect-square w-[50px] shrink-0 object-contain shadow-[0px_1px_13px_rgba(216,229,237,0.18)] sm:w-[61px]"
              />
            )}
          </div>
        }
      </div>
    </section>
  );
};

export default TeamInfo;
