"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, { _id: false });
var conversationSchema = new mongoose_1.Schema({
    subject: { type: String, required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }],
    context: {
        kind: { type: String, enum: ["booking", "swap", "support", "inquiry"] },
        ref: { type: mongoose_1.Schema.Types.ObjectId },
    },
    messages: { type: [messageSchema], default: [] },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Conversation", conversationSchema);
