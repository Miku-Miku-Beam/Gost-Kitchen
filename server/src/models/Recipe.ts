import mongoose, { Document, Schema } from "mongoose";

interface IRecipeIngredient {
  ingredientId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IRecipe extends Document {
  name: string;
  ingredients: IRecipeIngredient[];
  discoveredBy: mongoose.Types.ObjectId[];
}

const recipeSchema = new Schema<IRecipe>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  ingredients: [
    {
      ingredientId: {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  discoveredBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model<IRecipe>("Recipe", recipeSchema);
