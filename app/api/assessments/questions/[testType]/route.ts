import { NextResponse } from "next/server";
import { mockQuestions } from "@/app/constants/questions";

export async function GET(
  req: Request,
  { params }: { params: { testType: string } }
) {
  const { testType } = params;

  // Validate test type
  if (!testType) {
    return NextResponse.json({ success: false, message: "Invalid test type" }, { status: 400 });
  }

  try {
    // Fetch questions for the given test type
    const questions = mockQuestions[testType];

    if (!questions) {
      return NextResponse.json({ success: false, message: "Test type not found" }, { status: 404 });
    }

    // Return only 10 questions (if needed)
    return NextResponse.json({
      success: true,
      data: questions.slice(0, 10), // Limit to 10 questions
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch questions" }, { status: 500 });
  }
}
