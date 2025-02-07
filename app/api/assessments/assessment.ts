export interface Assessment {
    id: string;
    name: string;
    description: string;
    questions_count: number;
  }

export const assessments: Assessment[] = [
  {
    id: "1",
    name: "Depression Test",
    description: "A test to evaluate depression levels",
    questions_count: 10,
  },
  {
    id: "2",
    name: "Anxiety Test",
    description: "A test to assess anxiety symptoms",
    questions_count: 8,
  },
  {
    id: "3",
    name: "Stress Test",
    description: "A test to measure your stress levels",
    questions_count: 12,
  },
];
