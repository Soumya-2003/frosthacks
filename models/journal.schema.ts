import mongoose from 'mongoose';

const JournalSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Store date as a string in "dd-mm-yyyy"
  content: { type: String, required: true },
});

const JournalModel = mongoose.models.Journal || mongoose.model('Journal', JournalSchema);

export default JournalModel;
