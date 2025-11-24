"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var swapSchema = new mongoose_1.Schema({
    proposer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    proposerItem: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverItem: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
    cashAdjustment: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "counter", "accepted", "rejected"],
        default: "pending",
    },
    notes: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Swap", swapSchema);
