import image1 from '@/assets/imagesPerception/image1.jpeg';
import image2 from '@/assets/imagesPerception/image2.jpeg';
import image3 from '@/assets/imagesPerception/image3.jpeg';
import image4 from '@/assets/imagesPerception/image4.jpeg';
import { StaticImageData } from 'next/image';

const mentalHealthQuestions: string[] = [
    "In the last two weeks, how often have you felt nervous or anxious?",
    "How often do you find it hard to concentrate on daily tasks?",
    "I feel that I have little control over what happens in my life.",
    "How often do you feel overwhelmed by your responsibilities?",
    "Do you often feel sad or down without a clear reason?",
    "How frequently do you feel socially isolated or lonely?",
    "I find it difficult to relax, even in my free time.",
    "How often do you experience sudden mood changes?",
    "Do you feel confident in your ability to handle personal challenges?",
    "How often do you feel fatigued or low on energy without a clear cause?",
    "I feel satisfied with my social relationships and interactions.",
    "How often do you avoid social situations due to anxiety or discomfort?",
    "I struggle with feelings of self-doubt or low self-esteem.",
    "How often do you feel restless or unable to sit still?",
    "I find joy and satisfaction in my daily activities."
];

export const prompts = [
    ["happy"],
    ["angry"],
    ["joy"],
    ["sun"],
    ["peace"],
];

export const imageBasedQuestions: StaticImageData[] = [
    image1,
    image2,
    image3,
    image4
]

export default mentalHealthQuestions;


