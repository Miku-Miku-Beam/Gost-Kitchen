import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  discoveredRecipes: mongoose.Types.ObjectId[];
}

const UserProgressSchema: Schema<IUserProgress> = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  discoveredRecipes: [{ type: mongoose.Types.ObjectId, ref: "Recipe" }],
});

export const UserProgress = mongoose.model<IUserProgress>(
  "UserProgress",
  UserProgressSchema,
);
