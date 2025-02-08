import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { sentence, word } = await request.json();

    if (!sentence || !word) {
      return NextResponse.json(
        { error: "Both 'sentence' and 'word' are required." },
        { status: 400 }
      );
    }

    // Call the Flask API
    const flaskApiUrl = "http://localhost:5000/analyze-sentence";
    const response = await axios.post(flaskApiUrl, { sentence, word });

    // Return the Flask API response to the client
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error calling Flask API:", error);
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        { error: "Could not connect to the Flask API. Please check if the Flask server is running." },
        { status: 500 }
      );
    }
    if (error.response) {
      console.error("Flask API Error Response:", error.response.data);
      return NextResponse.json(
        { error: error.response.data.error || "An error occurred while analyzing the sentence." },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
