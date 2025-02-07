'use client'
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


interface successModalProps {
    isOpen: boolean,
    onClose: () => void,
    onNext: () => void
}

export const SuccessModal = ({ isOpen, onClose, onNext } : successModalProps) => {
    const { width, height } = useWindowSize();

    return(
        <>
            {
                isOpen && <Confetti width={width} height={height} numberOfPieces={300} gravity={0.3} />
            }

            <Dialog
                open={isOpen}
                onOpenChange={onClose}
            >
                <DialogContent
                    className='max-w-xl md:max-w-2xl lg:max-w-4xl p-6 md:p-8 text-center bg-white shado rounded-lg'
                >
                    <DialogHeader>
                        <DialogTitle
                            className='text-xl mdLtext-2xl font-bold text-gray-800'
                        >
                            🎉 Congratulations! 🎉
                        </DialogTitle>
                    </DialogHeader>

                    <p
                        className='text-gray-600 text-sm md:text-base'
                    >
                        You have successfully completed this section. Ready to move to the next challenge?
                    </p>

                    <DialogFooter
                        className='mt-4 flex flex-col gap-3'
                    >
                        <Button
                            className='w-full text-sm md:text-base py-2 md:py-3'
                            onClick={onNext}
                        >
                            Proceed to Next Stage 🚀
                        </Button>
                        <Button
                            variant={"outline"}
                            onClick={onClose}
                            className='w-full text-sm md:text-base'
                        >
                            Stay Here
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}