import React from 'react';  
import Image, { StaticImageData } from 'next/image';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  imageUrl: StaticImageData | string; 
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, name, imageUrl }) => {
  const rankPadding = rank === 1 ? 'mt-11 pr-3' : rank === 2 ? 'mt-2' : 'pl-3 mt-14';

  return (
    <div className="flex flex-col items-center">
      <div className={`self-center flex flex-col items-center ${rankPadding}`}>
        <Image
          src={imageUrl as StaticImageData}
          alt={`${name} avatar`}
          width={56}
          height={56}
          className="object-contain w-14 aspect-square"
        />
        <p className="mt-1">{name}</p>
      </div>
    </div>
  );
};

export default LeaderboardItem;
