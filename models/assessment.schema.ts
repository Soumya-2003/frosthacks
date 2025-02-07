import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessment extends Document {
  userID: string;
  responses: number[]; // Array of Likert scale values (e.g., [4, 3, 5, 2, 4])
  mood_score: number;   // Mood score calculated by the Flask API
  mood: string;         // Mood label (e.g., 'Happy', 'Sad', 'Neutral')
  date: Date;          // Timestamp of the assessment
}

const assessmentSchema = new Schema<IAssessment>({
  userID: { type: String, required: true },
  responses: { type: [Number], required: true },
  mood_score: { type: Number, required: true },
  mood: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const AssessmentModel = mongoose.model<IAssessment>('Assessment', assessmentSchema);

export default AssessmentModel;