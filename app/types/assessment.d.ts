export interface Question {
    id: number;
    text: string;
    weight: number;
  }
  
  export interface AssessmentStartRequest {
    userId: string;
    testType: string;
  }
  
  export interface AssessmentStartResponse {
    message: string;
    assessment: {
      id: string;
      userId: string;
      testType: string;
      startedAt: string;
      name: string;
      description: string;
      questions_count: number;
      questions: Question[];
    };
  }