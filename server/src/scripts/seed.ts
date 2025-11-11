import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Item from "../models/Item";
import Booking from "../models/Booking";
import Swap from "../models/Swap";
import Conversation from "../models/Conversation";
import Review from "../models/Review";
import Dispute from "../models/Dispute";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB. Clearing collections...");

  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Booking.deleteMany({}),
    Swap.deleteMany({}),
    Conversation.deleteMany({}),
    Review.deleteMany({}),
    Dispute.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);
  const [ownerOne, ownerTwo, renterOne] = await User.create([
    { email: "owner1@rentnswap.com", passwordHash, role: "admin" },
    { email: "owner2@rentnswap.com", passwordHash },
    { email: "renter1@rentnswap.com", passwordHash },
  ]);

  const items = await Item.create([
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
    },
  ]);

  const [bookingOne, bookingTwo] = await Booking.create([
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
  ]);

  await Review.create([
    {
      item: items[0]._id,
      booking: bookingTwo._id,
      fromUser: renterOne._id,
      toUser: ownerOne._id,
      rating: 5,
      comment: "Fantastic kit, great communication!",
    },
  ]);

  await Swap.create([
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
  ]);

  await Conversation.create([
    {
      subject: "Booking: DSLR kit",
      participants: [ownerOne._id, renterOne._id],
      context: { kind: "booking", ref: items[0]._id },
      messages: [
        { sender: renterOne._id, text: "Hi! Can I pick up tomorrow morning?", createdAt: new Date() },
        { sender: ownerOne._id, text: "Yes, 10am works! Need extra batteries?", createdAt: new Date() },
      ],
    },
    {
      subject: "Swap: Road bike",
      participants: [ownerTwo._id, renterOne._id],
      context: { kind: "swap", ref: items[2]._id },
      messages: [
        { sender: ownerTwo._id, text: "Interested in trading for your gown?", createdAt: new Date() },
      ],
    },
  ]);

  await Dispute.create([
    {
      booking: bookingOne._id,
      raisedBy: renterOne._id,
      description: "Lens cap missing on return.",
      status: "open",
    },
  ]);

  console.log("Seed completed.");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
