import { Schema, model, type Document, type Types } from "mongoose";

export interface IItem extends Document {
  owner: Types.ObjectId;
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  location: string;
  rating: number;
  swapEligible: boolean;
  availability: string[];
  images: string[];
  tags: string[];
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    swapEligible: { type: Boolean, default: false },
    availability: { type: [String], default: [] },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default model<IItem>("Item", itemSchema);
