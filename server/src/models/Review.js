"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var reviewSchema = new mongoose_1.Schema({
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
    booking: { type: mongoose_1.Schema.Types.ObjectId, ref: "Booking" },
    fromUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
}, { timestamps: true });
reviewSchema.index({ item: 1, fromUser: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)("Review", reviewSchema);
