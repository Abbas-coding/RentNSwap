import { Schema, model, type Document, type Types } from "mongoose";

export interface IDispute extends Document {
  booking: Types.ObjectId;
  raisedBy: Types.ObjectId;
  description: string;
  status: "open" | "in_review" | "resolved" | "rejected";
  resolution?: string;
  adminDecision?: string;
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_review", "resolved", "rejected"],
      default: "open",
    },
    resolution: { type: String },
    adminDecision: { type: String },
  },
  { timestamps: true }
);

export default model<IDispute>("Dispute", disputeSchema);
