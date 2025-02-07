import { NextResponse } from "next/server";
import { assessments } from "./assessment";


export async function GET() {
  return NextResponse.json({
    success: true,
    data: assessments,
  });
}
