import React from 'react';
import { Progress } from '@/components/ui/progress';
import icon1 from "@/assets/images/ico1.svg";
import icon2 from "@/assets/images/ico2.svg";
import circ from "@/assets/images/circle.svg";
import Image from "next/image";

const TeamInfo = () => {
  return (
    <section className="flex flex-col self-stretch pb-2.5 mt-3 w-full bg-customYellow rounded-2xl">

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
        <div className="flex justify-between mt-2.5 text-xs font-medium text-zinc-800 w-full">
          <div className="flex gap-2 items-center">

            <Image
              src={icon1 as HTMLImageElement}
              alt=""
              height={1000}
              width={1000}
              className="object-contain shrink-0 aspect-square w-[40px] sm:w-[61px]"

            />
            <p>
              Minimum requirement for silver tier currently is 600 points
            </p>
          </div>
          <Image
            src={icon2 as HTMLImageElement}
            alt=""
            height={1000}
            width={1000}
            className="object-contain shrink-0 aspect-square w-[50px] sm:w-[61px] shadow-[0px_1px_13px_rgba(216,229,237,0.18)]"
          />
        </div>
      </div>
    </section>
  );
};

export default TeamInfo;
