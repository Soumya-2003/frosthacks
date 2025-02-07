import mongoose, { Document, Schema } from 'mongoose';

export interface Assessment extends Document {
  userID: string;
  responses: number[]; // Array of Likert scale values (e.g., [4, 3, 5, 2, 4])
  moodScore: number;   // Mood score calculated by the Flask API
  mood: string;         // Mood label (e.g., 'Happy', 'Sad', 'Neutral')
  date: Date;          // Timestamp of the assessment
}

const assessmentSchema: Schema<Assessment> = new Schema({
  userID: { type: String, required: true },
  responses: { type: [Number], required: true },
  moodScore: { type: Number, required: true },
  mood: { type: String, required: true },
  date: { type: Date, default: Date.now },
},
{ timestamps: true }
);

const AssessmentModel = (mongoose.models.Assessment as mongoose.Model<Assessment>) || (mongoose.model<Assessment>("Assessment", assessmentSchema));

export default AssessmentModel;