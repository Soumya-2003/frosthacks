import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JournalModel from '@/models/journal.schema';
import SentimentModel from '@/models/sentiment.schema';
import { AutoTokenizer, AutoModelForSequenceClassification } from '@huggingface/transformers';
import * as torch from 'torch';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/models/user.schema';



// Load fine-tuned RoBERTa for emotion detection
const model_name = "joeddav/roberta-large-goemotions";
const tokenizer = await AutoTokenizer.from_pretrained(model_name);
const model = await AutoModelForSequenceClassification.from_pretrained(model_name);

// Define emotion labels from GoEmotions dataset
const emotion_labels: string[] = [
  "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion",
  "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment",
  "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness",
  "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise"
];

// Map detailed emotions to core categories
const emotion_mapping: { [key: string]: string } = {
  "joy": "happy", "amusement": "happy", "excitement": "happy", "love": "happy", "optimism": "happy",
  "sadness": "sad", "grief": "sad", "disappointment": "sad",
  "fear": "anxious", "nervousness": "anxious",
  "anger": "depressed", "remorse": "depressed", "disapproval": "depressed"
};

export async function POST(request: NextRequest) {
  await dbConnect();

  await dbConnect();

  try {
    
    const sesssion = await getServerSession(authOptions)

    if(!sesssion){
      return NextResponse.json(
        {
          message: "Unauthorized request!!",
        },
        {
          status: 401
        }
      )
    }

    // Fetch journal entries from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const existingUser = await UserModel.findOne({email: sesssion.user.email})
    if(!existingUser){
      return NextResponse.json({
        message: "User not found!!",
      }, {
        status: 404
      })
    }
    const userID = existingUser._id


    const journals = await JournalModel.find({
      userID,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    if (!journals || journals.length === 0) {
      return NextResponse.json({ message: "No journal entries found in the last 7 days" }, { status: 404 });
    }

    // Initialize overall emotion scores
    const overall_emotions: { [key: string]: number } = {
      happy: 0,
      sad: 0,
      anxious: 0,
      depressed: 0
    };

    // Process each journal entry
    for (const journal of journals) {
      const processed_text = journal.content.replace(/\n/g, " ").trim();
      const inputs = tokenizer(processed_text, { return_tensors: "pt", padding: true, truncation: true, max_length: 512 });

      const outputs = model(inputs);
      const logits = outputs.logits;
      const probs = torch.nn.functional.softmax(logits, -1);
      const top_emotions = torch.topk(probs, 3); // Get top 3 emotions

      for (let idx = 0; idx < top_emotions.indices[0].length; idx++) {
        const emotion = emotion_labels[top_emotions.indices[0][idx]];
        const probability = top_emotions.values[0][idx];

        const core_emotion = emotion_mapping[emotion] || "other";
        if (core_emotion in overall_emotions) {
          overall_emotions[core_emotion] += probability;
        }
      }
    }

    // Determine overall mood
    const overall_mood = Object.keys(overall_emotions).reduce((a, b) => overall_emotions[a] > overall_emotions[b] ? a : b);

    // Save the sentiment analysis results to the database
    const newSentiment = new SentimentModel({
      userID,
      overallEmotions: overall_emotions,
      overallMood: overall_mood.toUpperCase(),
    });

    await newSentiment.save();

    // Return the results
    return NextResponse.json(
      {
        message: "Emotion analysis completed successfully",
        overallEmotions: overall_emotions,
        overallMood: overall_mood.toUpperCase(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing emotions:", error);
    return NextResponse.json({ message: "An error occurred while analyzing emotions" }, { status: 500 });
  }
}