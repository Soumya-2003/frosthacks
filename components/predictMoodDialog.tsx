'use client'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MouseEventHandler } from 'react';
import { getSentimentStatement } from '@/helpers/giveSentiment';

interface PredictMoodDialogProps {
  isOpen: boolean;
  moodScore: number;
  onClose: () => void;
}

export const PredictMoodDialog = ({ isOpen, moodScore, onClose }: PredictMoodDialogProps) => {
  const sentiment = getSentimentStatement(moodScore);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-lg md:max-w-4xl p-6 md:p-8 text-center bg-white shadow rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800">{sentiment?.label}</DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 text-sm md:text-base">{sentiment?.description}</p>

        <p className="text-gray-600 text-sm md:text-base">
        {sentiment?.statements[Math.floor(Math.random() * sentiment.statements.length)]}
        </p>

        <DialogFooter className="mt-4 flex flex-col gap-3">
          <Button className="w-full text-sm md:text-base py-2 md:py-3">Need Help ?</Button>
          <Button onClick={onClose} variant="outline" className="w-full text-sm md:text-base">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};