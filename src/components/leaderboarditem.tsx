import React from 'react';
import Image, { StaticImageData } from 'next/image';  // Import Image component

interface LeaderboardItemProps {
  rank: number;
  name: string;
  imageUrl: StaticImageData;  // StaticImageData type for the image
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, name, imageUrl }) => {
  const rankPadding = rank === 1 ? 'mt-2' : rank === 2 ? 'mt-8 pr-12' : 'mt-12 pl-12';

  return (
    <div className="flex flex-col">
      <div className={`self-center flex flex-col mt-11 ${rankPadding}`}>
        <Image
          src={imageUrl}           // Use Image component for static images
          alt={`${name} avatar`}
          width={56}               // Set explicit width
          height={56}              // Set explicit height
          className="flex object-contain self-center w-14 aspect-square"
        />
        <p className="mt-1 pl-5">{name}</p>
      </div>
    </div>
  );
};

export default LeaderboardItem;
