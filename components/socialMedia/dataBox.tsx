import { cn } from '@/lib/utils';
import { useState } from 'react';
import { WobbleCard } from '../ui/wobble-card';
import { poppins } from '@/helpers/fonts';
import { ChildNode } from "../socialMediaAnalysisTool";


interface DataBoxesProps {
  data: ChildNode[];
  color: string;
}

export const DataBoxes = ({ data, color }: DataBoxesProps) => {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      {data.map((el, index) => (
        <WobbleCard containerClassName={`col-span-1 ${color}`} key={index}>
          <p className="mb-2">{Object.keys(el)[0]}</p>
          {Object.values(el)[0].map((v: any[], i: number) => (
            <p
              className={cn("text-md md:text-sm lg:text-lg font-extrabold", poppins.className)}
              key={i}
            >
              {v[0]} - {v[1]}
            </p>
          ))}
        </WobbleCard>
      ))}
    </div>
  );
};