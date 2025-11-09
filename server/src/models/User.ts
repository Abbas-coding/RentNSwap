import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  email?: string;
  phone?: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
