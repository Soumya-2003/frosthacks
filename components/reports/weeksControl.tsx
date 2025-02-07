import React from 'react';
import { Button } from '@/components/ui/button';
import { formatWeek, isNextWeekAvailable, isSameDay } from '@/lib/utils';

interface WeekControlsProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
}

const WeekControls: React.FC<WeekControlsProps> = ({ currentDate, setCurrentDate, isLoading }) => {
  return (
    <div className="flex items-center justify-around">
      <Button
      variant="outline"
      size="sm"
        onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
        disabled={isLoading}
      >
        Previous Week
      </Button>
      <span className="font-bold p-4">{formatWeek(currentDate)}</span>
      <Button
       variant="outline"
      size="sm"
        onClick={() => setCurrentDate(new Date())}
        disabled={isLoading || isSameDay(currentDate, new Date())}
      >
        Current Week
      </Button>
      <Button
       variant="outline"
      size="sm"
        onClick={() => {
          const today = new Date();
          const nextWeekDate = new Date(currentDate);
          nextWeekDate.setDate(currentDate.getDate() + 7);
          if (nextWeekDate.getTime() <= today.getTime()) {
            setCurrentDate(nextWeekDate);
          }
        }}
        disabled={isLoading || isNextWeekAvailable(currentDate)}
      >
        Next Week
      </Button>
    </div>
  );
};

export default WeekControls;