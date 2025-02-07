import mongoose, { Document, Schema } from 'mongoose';

export interface Sentiment extends Document {
  userID: string;
  overallEmotions: { [key: string]: number };
  overallMood: string;
  date: Date; // Timestamp
}

const sentimentSchema: Schema<Sentiment> = new Schema({
  userID: { type: String, required: true },
  overallEmotions: { type: Map, of: Number, required: true },
  overallMood: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const SentimentModel =
  (mongoose.models.Sentiment as mongoose.Model<Sentiment>) ||
  mongoose.model<Sentiment>('Sentiment', sentimentSchema);

export default SentimentModel;