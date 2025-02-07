import mongoose, { Document, Schema } from 'mongoose';

export interface Sentiment extends Document {
  userID: string; // Reference to the user
  results: object; // Sentiment analysis results
  createdAt: Date; // Timestamp
}

const sentimentSchema: Schema<Sentiment> = new Schema({
  userID: { type: String, required: true },
  results: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SentimentModel =
  (mongoose.models.Sentiment as mongoose.Model<Sentiment>) ||
  mongoose.model<Sentiment>('Sentiment', sentimentSchema);

export default SentimentModel;