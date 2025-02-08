import { cn } from '@/lib/utils';
import { useState } from 'react';
import { WobbleCard } from '../ui/wobble-card';
import { poppins } from '@/helpers/fonts';

interface JournalReportBoxProps {
  overall_mood: string;
  overall_emotions: {
    happy: number;
    sad: number;
    anxious: number;
    depressed: number;
  };
}

type Emotion = 'anxious' | 'depressed' | 'happy' | 'sad';

const emoteMap: Record<Emotion, string> = {
  anxious: "😥",
  depressed: "😞",
  happy: "😊",
  sad: "😔"
}

export const JournalReportBox = (props: JournalReportBoxProps) => {
  return (
    <div>
       <h1 className='text-lg text-center mb-3 mt-8'>Weekly Journal Analysis</h1>
      <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      <WobbleCard containerClassName="col-span-1 bg-teal-600">
        <p
          className={cn(
            "text-md md:text-sm lg:text-lg font-extrabold",
            poppins.className
          )}
        >
          Overall Mood: {props.overall_mood}
        </p>
        <div>
          <h3>Emotions</h3>
          {Object.entries(props.overall_emotions).map(([emotion, value]) => (
            <p key={emotion}>
              {emotion} {emoteMap[emotion as Emotion]}: {parseFloat(value.toFixed(1)) * 10} %
            </p>
          ))}
        </div>
      </WobbleCard>
    </div>
    </div>
  );
};