import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId;
  recipeName: string;
  status: "pending" | "served" | "expired";
  createdAt: Date;
  expiresAt: Date;
  sertedAt?: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipeId: {
    type: mongoose.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  recipeName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "served", "expired"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  sertedAt: {
    type: Date,
  },
});

export default mongoose.model<IOrder>("Order", orderSchema);
