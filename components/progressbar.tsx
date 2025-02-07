import { Progress } from "@/components/ui/progress";

interface progressBarProps {
    current: number,
    total: number
}



export const ProgressBar = ({ current, total } : progressBarProps) => {

    const progressPercentage = ( current / total ) * 100;

    return(
        <div
            className="w-full mb-6"
        >
            <Progress value={progressPercentage} className="h-3 mb-2"/>
        </div>
    );
}