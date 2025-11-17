import { Schema, model, type Document, type Types } from "mongoose";

interface IMessage {
  sender: Types.ObjectId;
  text: string;
  createdAt: Date;
  readBy: Types.ObjectId[];
}

export interface IConversation extends Document {
  subject: string;
  participants: Types.ObjectId[];
  context?: {
    kind: "booking" | "swap" | "support" | "inquiry";
    ref?: Types.ObjectId;
  };
  messages: IMessage[];
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    subject: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    context: {
      kind: { type: String, enum: ["booking", "swap", "support", "inquiry"] },
      ref: { type: Schema.Types.ObjectId },
    },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IConversation>("Conversation", conversationSchema);
