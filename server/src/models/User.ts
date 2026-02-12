import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  restaurantName: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  restaurantName: {
    type: String,
    required: [true, "Le nom du restaurant est requis"],
    trim: true,
    minlength: [3, "Le nom doit contenir au moins 3 caractères"],
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email invalide"],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est requis"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>("User", userSchema);
