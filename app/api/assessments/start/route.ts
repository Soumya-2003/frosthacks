// app/api/assessments/start/route.ts
import { NextResponse } from 'next/server';
import { assessments } from '../assessment';
import { mockQuestions } from '@/app/constants/questions';
import { AssessmentStartRequest, AssessmentStartResponse } from '@/app/types/assessment';

export async function POST(request: Request) {
  try {
    const body: AssessmentStartRequest = await request.json();

    // Validate required fields
    if (!body.userId || !body.testType) {
      return NextResponse.json(
        { error: 'User ID and Test Type are required' },
        { status: 400 }
      );
    }

    const { userId, testType } = body;

    // Fetch questions for the given test type
    const questions = mockQuestions[testType.toLowerCase()];

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or unsupported test type' },
        { status: 404 }
      );
    }

    // Find the assessment metadata
    const assessmentMetadata = assessments.find(
      (a) => a.name.toLowerCase().includes(testType.toLowerCase())
    );

    if (!assessmentMetadata) {
      return NextResponse.json(
        { error: 'Assessment metadata not found' },
        { status: 404 }
      );
    }

    const assessmentId = `assessment_${Date.now()}`; // Generate a unique ID for the assessment
    const startedAt = new Date().toISOString();

    // Return success response
    const response: AssessmentStartResponse = {
      message: 'Assessment started successfully',
      assessment: {
        id: assessmentId,
        userId,
        testType,
        startedAt,
        name: assessmentMetadata.name,
        description: assessmentMetadata.description,
        questions_count: assessmentMetadata.questions_count,
        questions,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}