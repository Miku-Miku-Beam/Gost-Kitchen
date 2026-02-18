import mongoose from "mongoose";

export interface ITransaction extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: "purchase" | "sale" | "penalty";
  amount: number;
  description: string;
  relatedOrderId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["purchase", "sale", "penalty"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  relatedOrderId: {
    type: mongoose.Types.ObjectId,
    ref: "Order",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
