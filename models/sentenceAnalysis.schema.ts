import mongoose, { Schema, Document, model } from "mongoose";

interface ISentenceAnalysis extends Document {
    userID: mongoose.Types.ObjectId;
    word: string;
    sentence: string;
    mood: string;
    date: Date;
}

const SentenceAnalysisSchema = new Schema<ISentenceAnalysis>(
    {
        userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
        word: { type: String, required: true },
        sentence: { type: String, required: true },
        mood: { type: String, required: true },
        date: { type: Date, required: true },
    },
    { timestamps: true }
);

const SentenceAnalysisModel = model<ISentenceAnalysis>("SentenceAnalysis", SentenceAnalysisSchema);
export default SentenceAnalysisModel;
