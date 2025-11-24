"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bookingSchema = new mongoose_1.Schema({
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    renter: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "active", "completed", "cancelled"],
        default: "pending",
    },
    deposit: { type: Number, default: 0 },
    notes: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Booking", bookingSchema);
