import React from 'react';
import { Progress } from '@/components/ui/progress';
import icon1 from "@/assets/images/ico1.svg";
import icon2 from "@/assets/images/ico2.svg";
import circ from "@/assets/images/circle.svg";
import Image from "next/image";

interface TeamInfoProps {}

const TeamInfo: React.FC<TeamInfoProps> = () => {
  return (
    <section className="flex flex-col self-stretch pb-2.5 mt-3 w-full bg-customYellow rounded-2xl">
      <div className="flex self-start text-base font-medium">
        <Image
          loading="lazy"
          src={circ}
          alt="Team avatar"
          className="object-contain shrink-0 aspect-square shadow-[0px_1px_24px_rgba(216,229,237,0.18)] w-[130px]"
        />
        <div className="flex flex-col items-start my-auto">
          <h2 className="self-stretch font-bold text-xl text-black">Team Name</h2>
          <p className="text-black">400 Points</p>
          <p className="mt-1 text-xs text-zinc-600">Bronze Tier</p>
        </div>
      </div>
      <div className="flex flex-col px-3 w-full">
        <Progress />
        <div className="flex justify-between mt-2.5 text-xs font-medium text-zinc-800 w-full">
          <div className="flex gap-2 items-center">
            <Image
              loading="lazy"
              src={icon1}
              alt=""
              className="object-contain shrink-0 aspect-square w-[40px] sm:w-[61px]"
            />
            <p>
              Minimum requirement for silver tier currently is 600 points
            </p>
          </div>
          <Image
            loading="lazy"
            src={icon2}
            alt=""
            className="object-contain shrink-0 aspect-square w-[50px] sm:w-[61px] shadow-[0px_1px_13px_rgba(216,229,237,0.18)]"
          />
        </div>
      </div>
    </section>
  );
};

export default TeamInfo;
