import React from 'react';  
import Image, { StaticImageData } from 'next/image';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  imageUrl: StaticImageData | string; // Either local or remote image
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, name, imageUrl }) => {
  const rankPadding = rank === 1 ? 'mt-2' : rank === 2 ? 'mt-8 pr-12' : 'mt-12 pl-12';

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
        <p className="mt-1">{name}</p> {/* Displaying team name from props */}
      </div>
    </div>
  );
};

export default LeaderboardItem;
