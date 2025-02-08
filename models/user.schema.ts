import mongoose, { Document, Schema } from 'mongoose';


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    role: 'user' | 'admin',
    age?: number,
    gender?: 'male' | 'female' | 'other',
    profilePicture?: string,
    passwordResetToken?: string,
    passwordResetExpiryTime?: Date,
    oAuth?: boolean,
    loginHistory: { date: string }[]
}

const userSchema: Schema<User> = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // Store as hashed password
    role: { type: String, enum: ["user", "admin"], default: "user" },
    age: { type: Number, min: 13 }, // Assuming a minimum age requirement
    gender: { type: String, enum: ["male", "female", "other"] },
    passwordResetToken: { type: String },
    passwordResetExpiryTime: { type: Date },
    profilePicture: { type: String, default: "" },
    oAuth: { type: Boolean, default: false },
    loginHistory: [
        {
            date: { type: String, required: true }, // Store date as YYYY-MM-DD
        }
    ]
},
    { timestamps: true }
)

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema));

export default UserModel;