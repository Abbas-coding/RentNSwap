"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var itemSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    swapEligible: { type: Boolean, default: false },
    availability: { type: [String], default: [] },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Item", itemSchema);
