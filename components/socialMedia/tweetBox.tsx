import { cn } from '@/lib/utils';
import { useState } from 'react';
import { WobbleCard } from '../ui/wobble-card';
import { poppins } from '@/helpers/fonts';

interface TweetBoxesProps {
    tweets: string[];
  }

export const TweetBoxes = ({tweets}: TweetBoxesProps) => {

  return (
    <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      {tweets.map((tweet, index) => (
        <WobbleCard containerClassName={`col-span-1 bg-teal-600`} key={index}>
          <p
            className={cn("text-md md:text-sm lg:text-lg font-extrabold", poppins.className)}
          >
            {tweet}
          </p>
        </WobbleCard>
      ))}
    </div>
  );
};