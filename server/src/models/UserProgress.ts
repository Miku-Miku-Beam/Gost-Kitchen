import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  discoveredRecipes: mongoose.Types.ObjectId[];
  satisfaction: number;
}

const UserProgressSchema: Schema<IUserProgress> = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  discoveredRecipes: [{ type: mongoose.Types.ObjectId, ref: "Recipe" }],
  satisfaction: { type: Number, default: 20, min: 0 },
});

export const UserProgress = mongoose.model<IUserProgress>(
  "UserProgress",
  UserProgressSchema,
);
