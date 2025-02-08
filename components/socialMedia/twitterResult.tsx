import { poppins } from "@/helpers/fonts";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { AnalyedData } from "../socialMediaAnalysisTool";
import { useState } from "react";
import { TweetBoxes } from "./tweetBox";
import { DataBoxes } from "./dataBox";

const tabs = {
  TWEETS: "Tweets",
  POSITIVES: "Positives",
  NEGATIVES: "Negatives",
};

interface TwitterResultProps {
    analyzedData: AnalyedData,
    tweets: string[];
}

export const TwitterResult = ({ analyzedData, tweets }: TwitterResultProps) => {
    console.log(analyzedData);
  const [activeTab, setActiveTab] = useState(tabs.TWEETS);

  return (
    <div>
      <ToggleGroup
        type="single"
        value={activeTab}
        onValueChange={(value) => value && setActiveTab(value)}
        className={cn("flex space-x-2 justify-center mb-8", poppins.className)}
      >
        <ToggleGroupItem
          value={tabs.TWEETS}
          className={`px-3 py-1 rounded-md ${
            activeTab === tabs.TWEETS ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {tabs.TWEETS}
        </ToggleGroupItem>
        <ToggleGroupItem
          value={tabs.POSITIVES}
          className={`px-3 py-1 rounded-md ${
            activeTab === tabs.POSITIVES ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {tabs.POSITIVES}
        </ToggleGroupItem>
        <ToggleGroupItem
          value={tabs.NEGATIVES}
          className={`px-3 py-1 rounded-md ${
            activeTab === tabs.NEGATIVES ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {tabs.NEGATIVES}
        </ToggleGroupItem>
      </ToggleGroup>

      {activeTab === tabs.TWEETS && (
        <div>
          <TweetBoxes tweets={tweets} />
        </div>
      )}

      {activeTab === tabs.POSITIVES && (
        <div>
          <DataBoxes data={analyzedData.positive} color="bg-green-600"/>
        </div>
      )}

      {activeTab === tabs.NEGATIVES && (
        <div>
          <DataBoxes data={analyzedData.negative} color="bg-pink-600" />
        </div>
      )}
    </div>
  );
};