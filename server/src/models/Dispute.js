"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var disputeSchema = new mongoose_1.Schema({
    booking: { type: mongoose_1.Schema.Types.ObjectId, ref: "Booking", required: true },
    raisedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ["open", "in_review", "resolved", "rejected"],
        default: "open",
    },
    resolution: { type: String },
    adminDecision: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Dispute", disputeSchema);
