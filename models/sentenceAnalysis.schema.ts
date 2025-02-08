import mongoose, { Schema, Document, model } from "mongoose";

interface SentenceAnalysis extends Document {
    userID: mongoose.Types.ObjectId;
    word: string;
    sentence: string;
    mood: string;
    date: Date;
}

const sentenceAnalysisSchema = new Schema<SentenceAnalysis>(
    {
        userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
        word: { type: String, required: true },
        sentence: { type: String, required: true },
        mood: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { timestamps: true }
);

const SentenceAnalysisModel = (mongoose.models.SentenceAnalysis as mongoose.Model<SentenceAnalysis>) || (mongoose.model<SentenceAnalysis>("SentenceAnalysis", sentenceAnalysisSchema));


export default SentenceAnalysisModel;