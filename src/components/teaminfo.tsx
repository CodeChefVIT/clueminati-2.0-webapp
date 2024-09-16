import circ from "@/assets/images/circle.svg";
import icon1 from "@/assets/images/ico1.svg";
import icon2 from "@/assets/images/ico2.svg";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

const TeamInfo = () => {
  return (
    <section className="custom-yellow mt-3 flex w-full flex-col self-stretch rounded-2xl pb-2.5">
      <div className="flex self-start text-base font-medium">
        <Image
          src={circ as HTMLImageElement}
          alt="Team avatar"
          height={1000}
          width={1000}
          className="aspect-square w-[130px] shrink-0 object-contain shadow-[0px_1px_24px_rgba(216,229,237,0.18)]"
        />
        <div className="my-auto flex flex-col items-start">
          <h2 className="self-stretch text-xl font-bold text-black">
            Team Name
          </h2>
          <p className="text-black">400 Points</p>
          <p className="mt-1 text-xs text-zinc-600">Bronze Tier</p>
        </div>
      </div>
      <div className="flex w-full flex-col px-3">
        <Progress />
        <div className="mt-2.5 flex gap-2 text-xs font-medium text-zinc-800">
          <div className="flex flex-auto gap-1">
            <Image
              src={icon1 as HTMLImageElement}
              alt=""
              height={1000}
              width={1000}
              className="aspect-square w-[61px] shrink-0 object-contain"
            />
            <p className="my-auto">
              Minimum requirement for silver tier currently is 600 points
            </p>
          </div>
          <Image
            src={icon2 as HTMLImageElement}
            alt=""
            height={1000}
            width={1000}
            className="w-18 my-auto aspect-square shrink-0 object-contain shadow-[0px_1px_13px_rgba(216,229,237,0.18)]"
          />
        </div>
      </div>
    </section>
  );
};

export default TeamInfo;
