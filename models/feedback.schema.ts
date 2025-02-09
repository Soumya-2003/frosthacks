import mongoose, { Schema, Document, model } from "mongoose";

interface Feedback extends Document {
    name: string;
    email: string;
    rating: number;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}

const feedbackSchema = new Schema<Feedback>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        feedback: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const FeedbackModel =
    (mongoose.models.Feedback as mongoose.Model<Feedback>) ||
    mongoose.model<Feedback>("Feedback", feedbackSchema);

export default FeedbackModel;
