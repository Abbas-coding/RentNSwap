import { Schema, model, type Document, type Types } from "mongoose";

export type SwapStatus = "pending" | "counter" | "accepted" | "rejected";

export interface ISwap extends Document {
  proposer: Types.ObjectId;
  proposerItem: Types.ObjectId;
  receiver: Types.ObjectId;
  receiverItem: Types.ObjectId;
  cashAdjustment?: number;
  status: SwapStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const swapSchema = new Schema<ISwap>(
  {
    proposer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    proposerItem: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverItem: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    cashAdjustment: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "counter", "accepted", "rejected"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default model<ISwap>("Swap", swapSchema);
