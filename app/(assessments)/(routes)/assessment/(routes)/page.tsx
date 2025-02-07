'use client'

import { SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import ImagePerception from "./imageperception/page";
import Questionaire from "./questionarries/page";
import SentenceFormation from "./sentenceformation/page";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AssessmentOptions } from "@/helpers/constants";
import { poppins } from "@/helpers/fonts";

const AssessmentPage = () => {
    const [selectedComponent, setSelectedComponent] = useState<AssessmentOptions>(AssessmentOptions.Questionaire);
    const handleSelection = (value: AssessmentOptions) => {
        setSelectedComponent(value);
    };
    return (
        <div className={cn("w-full max-w-5xl flex flex-col items-center min-h-screen p-6  bg-white/70 dark:bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl md:p-8 border border-gray-300 dark:border-white/70 text-gray-900 dark:text-white", poppins.className)}>
            <h1 className="text-3xl font-bold mb-6">Assessment Page</h1>
            <ToggleGroup
                type="single"
                value={selectedComponent}
                onValueChange={(value) => value && handleSelection(value as AssessmentOptions)}
                className="flex space-x-4 justify-center mb-8"
            >
                <ToggleGroupItem
                    value={AssessmentOptions.Questionaire}
                    className={`px-4 py-2 rounded-md ${selectedComponent === AssessmentOptions.Questionaire ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    Questionaire
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={AssessmentOptions.ImagePerception}
                    className={`px-4 py-2 rounded-md ${selectedComponent === AssessmentOptions.ImagePerception ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    Image Perception
                </ToggleGroupItem>
                <ToggleGroupItem
                    value={AssessmentOptions.SentenceFormation}
                    className={`px-4 py-2 rounded-md ${selectedComponent === AssessmentOptions.SentenceFormation ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    Sentence Formation
                </ToggleGroupItem>
            </ToggleGroup>
            <div className="w-full max-w-4xl">
                {selectedComponent === AssessmentOptions.ImagePerception && <ImagePerception />}
                {selectedComponent === AssessmentOptions.Questionaire && <Questionaire />}
                {selectedComponent === AssessmentOptions.SentenceFormation && <SentenceFormation />}
            </div>
        </div>
    );
};

export default AssessmentPage;