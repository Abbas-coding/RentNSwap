import { Schema, model, type Document, type Types } from "mongoose";

export type BookingStatus = "pending" | "approved" | "active" | "completed" | "cancelled";

export interface IBooking extends Document {
  item: Types.ObjectId;
  owner: Types.ObjectId;
  renter: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  deposit: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "active", "completed", "cancelled"],
      default: "pending",
    },
    deposit: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default model<IBooking>("Booking", bookingSchema);
