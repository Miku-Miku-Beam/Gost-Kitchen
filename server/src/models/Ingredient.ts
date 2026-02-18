import mongoose, { Document, Schema } from "mongoose";

export interface IIngredient extends Document {
  name: string;
  category: string;
  price: number;
}

const ingredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: [true, "Le nom de l'ingrédient est requis"],
    unique: true,
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
  },
  category: {
    type: String,
    required: [true, "La catégorie de l'ingrédient est requise"],
    enum: [
      "légume",
      "viande",
      "poisson",
      "produit laitier",
      "féculent",
      "autre",
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

export default mongoose.model<IIngredient>("Ingredient", ingredientSchema);
