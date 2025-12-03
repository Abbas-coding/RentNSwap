import { Schema, model, type Document, type Types } from "mongoose";

export interface IReview extends Document {
  item: Types.ObjectId;
  booking?: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

export default model<IReview>("Review", reviewSchema);
