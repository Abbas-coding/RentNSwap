"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var fs_1 = require("fs");
var mongoose_1 = require("mongoose");
var bcryptjs_1 = require("bcryptjs");
var User_1 = require("../models/User");
var Item_1 = require("../models/Item");
var Booking_1 = require("../models/Booking");
var Swap_1 = require("../models/Swap");
var Conversation_1 = require("../models/Conversation");
var Review_1 = require("../models/Review");
var Dispute_1 = require("../models/Dispute");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "server", ".env") });
var seedAssetsDir = path_1.default.join(__dirname, "seed-assets");
var uploadsDir = path_1.default.join(__dirname, "..", "..", "uploads");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, passwordHash, _a, ownerOne, ownerTwo, renterOne, seedImages, copyRandomImage, items, _b, bookingOne, bookingTwo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    uri = process.env.MONGO_URI;
                    if (!uri) {
                        throw new Error("Missing MONGO_URI");
                    }
                    return [4 /*yield*/, mongoose_1.default.connect(uri)];
                case 1:
                    _c.sent();
                    console.log("Connected to MongoDB. Clearing collections...");
                    return [4 /*yield*/, Promise.all([
                            User_1.default.deleteMany({}),
                            Item_1.default.deleteMany({}),
                            Booking_1.default.deleteMany({}),
                            Swap_1.default.deleteMany({}),
                            Conversation_1.default.deleteMany({}),
                            Review_1.default.deleteMany({}),
                            Dispute_1.default.deleteMany({}),
                        ])];
                case 2:
                    _c.sent();
                    // Clear and prepare uploads directory
                    if (fs_1.default.existsSync(uploadsDir)) {
                        fs_1.default.rmSync(uploadsDir, { recursive: true, force: true });
                    }
                    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
                    return [4 /*yield*/, bcryptjs_1.default.hash("password123", 10)];
                case 3:
                    passwordHash = _c.sent();
                    return [4 /*yield*/, User_1.default.create([
                            { email: "owner1@rentnswap.com", password: passwordHash, role: "admin" },
                            { email: "owner2@rentnswap.com", password: passwordHash },
                            { email: "renter1@rentnswap.com", password: passwordHash },
                        ])];
                case 4:
                    _a = _c.sent(), ownerOne = _a[0], ownerTwo = _a[1], renterOne = _a[2];
                    seedImages = fs_1.default.readdirSync(seedAssetsDir);
                    copyRandomImage = function () {
                        if (seedImages.length === 0)
                            return null;
                        var randomImage = seedImages[Math.floor(Math.random() * seedImages.length)];
                        var sourcePath = path_1.default.join(seedAssetsDir, randomImage);
                        var destFileName = "".concat(Date.now(), "-").concat(randomImage);
                        var destPath = path_1.default.join(uploadsDir, destFileName);
                        fs_1.default.copyFileSync(sourcePath, destPath);
                        return "uploads/".concat(destFileName);
                    };
                    return [4 /*yield*/, Item_1.default.create([
                            {
                                owner: ownerOne._id,
                                title: "Sony A7 IV creator pack",
                                category: "Photography",
                                description: "Mirrorless body, 24-70 f/2.8 lens, 2x batteries, 128gb SD card.",
                                pricePerDay: 35,
                                deposit: 75,
                                location: "Downtown",
                                rating: 4.9,
                                swapEligible: true,
                                availability: ["Weekdays", "Weekends"],
                                tags: ["featured"],
                                images: [copyRandomImage()].filter(Boolean),
                            },
                            {
                                owner: ownerOne._id,
                                title: "Boho ceremony arch",
                                category: "Events",
                                description: "Wooden arch with pampas accents. Fits compact SUVs.",
                                pricePerDay: 45,
                                deposit: 120,
                                location: "Riverside",
                                rating: 5,
                                swapEligible: false,
                                availability: ["Weekends"],
                                tags: ["featured"],
                                images: [copyRandomImage()].filter(Boolean),
                            },
                            {
                                owner: ownerTwo._id,
                                title: "Cordless tool bundle",
                                category: "DIY",
                                description: "Drill, circular saw, sander, and spare batteries.",
                                pricePerDay: 22,
                                deposit: 60,
                                location: "Midtown",
                                rating: 4.8,
                                swapEligible: true,
                                availability: ["Flexible"],
                                images: [copyRandomImage()].filter(Boolean),
                            },
                            {
                                owner: ownerTwo._id,
                                title: "Designer evening gown",
                                category: "Fashion",
                                description: "Size 4, dry-cleaned between rentals.",
                                pricePerDay: 28,
                                deposit: 80,
                                location: "Soho",
                                rating: 4.9,
                                swapEligible: false,
                                availability: ["Weekends"],
                                tags: ["featured"],
                                images: [copyRandomImage()].filter(Boolean),
                            },
                        ])];
                case 5:
                    items = _c.sent();
                    return [4 /*yield*/, Booking_1.default.create([
                            {
                                item: items[0]._id,
                                owner: ownerOne._id,
                                renter: renterOne._id,
                                startDate: new Date(),
                                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                                status: "pending",
                                deposit: 75,
                            },
                            {
                                item: items[1]._id,
                                owner: ownerOne._id,
                                renter: renterOne._id,
                                startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                                endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                                status: "approved",
                                deposit: 120,
                            },
                        ])];
                case 6:
                    _b = _c.sent(), bookingOne = _b[0], bookingTwo = _b[1];
                    return [4 /*yield*/, Review_1.default.create([
                            {
                                item: items[0]._id,
                                booking: bookingTwo._id,
                                fromUser: renterOne._id,
                                toUser: ownerOne._id,
                                rating: 5,
                                comment: "Fantastic kit, great communication!",
                            },
                        ])];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, Swap_1.default.create([
                            {
                                proposer: ownerTwo._id,
                                proposerItem: items[2]._id,
                                receiver: ownerOne._id,
                                receiverItem: items[0]._id,
                                cashAdjustment: 40,
                                status: "pending",
                            },
                            {
                                proposer: renterOne._id,
                                proposerItem: items[3]._id,
                                receiver: ownerTwo._id,
                                receiverItem: items[2]._id,
                                cashAdjustment: 0,
                                status: "counter",
                            },
                        ])];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, Conversation_1.default.create([
                            {
                                subject: "Booking: DSLR kit",
                                participants: [ownerOne._id, renterOne._id],
                                context: { kind: "booking", ref: items[0]._id },
                                messages: [
                                    { sender: renterOne._id, text: "Hi! Can I pick up tomorrow morning?", createdAt: new Date(), readBy: [] },
                                    { sender: ownerOne._id, text: "Yes, 10am works! Need extra batteries?", createdAt: new Date(), readBy: [] },
                                ],
                            },
                            {
                                subject: "Swap: Road bike",
                                participants: [ownerTwo._id, renterOne._id],
                                context: { kind: "swap", ref: items[2]._id },
                                messages: [
                                    { sender: ownerTwo._id, text: "Interested in trading for your gown?", createdAt: new Date(), readBy: [] },
                                ],
                            },
                        ])];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, Dispute_1.default.create([
                            {
                                booking: bookingOne._id,
                                raisedBy: renterOne._id,
                                description: "Lens cap missing on return.",
                                status: "open",
                            },
                        ])];
                case 10:
                    _c.sent();
                    console.log("Seed completed.");
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 11:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (error) {
    console.error(error);
    process.exit(1);
});
