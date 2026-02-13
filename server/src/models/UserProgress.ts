import mongoose, { Document, Schema } from "mongoose";

interface IStockItem {
  ingredientId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  discoveredRecipes: mongoose.Types.ObjectId[];
  satisfaction: number;
  money: number;
  stock: IStockItem[];
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
  money: { type: Number, default: 1000, min: 0 },
  stock: [
    {
      ingredientId: {
        type: mongoose.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
});

export const UserProgress = mongoose.model<IUserProgress>(
  "UserProgress",
  UserProgressSchema,
);
