import mongoose, { Document, Schema } from 'mongoose';

export interface Journal extends Document {
  userID: string; 
  date: Date;     
  content: string; 
}

const journalSchema: Schema<Journal> = new Schema({
  userID: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true }, 
  content: { type: String, required: true },
});

const JournalModel =
  (mongoose.models.Journal as mongoose.Model<Journal>) ||
  mongoose.model<Journal>('Journal', journalSchema);

export default JournalModel;