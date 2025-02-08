import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    age?: number;
    gender?: 'male' | 'female' | 'other';
    profilePicture?: string;
    passwordResetToken?: string;
    passwordResetExpiryTime?: Date;
    oAuth?: boolean;
    loginHistory: string[];
}

const userSchema: Schema<User> = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    age: { type: Number, min: 13 },
    gender: { type: String, enum: ["male", "female", "other"] },
    passwordResetToken: { type: String },
    passwordResetExpiryTime: { type: Date },
    profilePicture: { type: String, default: "" },
    oAuth: { type: Boolean, default: false },
    loginHistory: { 
        type: [String], 
        default: [], // ✅ Ensure it initializes as an empty array
        required: true
    }
}, { timestamps: true });

// Debug when user is created
userSchema.post('save', function (doc) {
    console.log("✅ New user saved:", doc);
});

const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);
export default UserModel;
