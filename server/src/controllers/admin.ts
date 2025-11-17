import asyncHandler from "express-async-handler";
import User from "../models/User";
import Item from "../models/Item";
import Booking from "../models/Booking";
import Swap from "../models/Swap";
import Review from "../models/Review";
import Dispute from "../models/Dispute";

export const adminOverview = asyncHandler(async (_req, res) => {
  const [userCount, itemCount, bookingCount, swapCount, reviewCount, disputeCount] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments(),
    Booking.countDocuments(),
    Swap.countDocuments(),
    Review.countDocuments(),
    Dispute.countDocuments(),
  ]);

  const latestBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("item", "title")
    .populate("renter", "email")
    .lean();

  const topCategories = await Item.aggregate([
    { $group: { _id: "$category", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  const disputes = await Dispute.find().sort({ updatedAt: -1 }).limit(5).populate("booking", "item").lean();

  res.json({
    stats: { users: userCount, items: itemCount, bookings: bookingCount, swaps: swapCount, reviews: reviewCount, disputes: disputeCount },
    latestBookings,
    topCategories,
    disputes,
  });
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

export const getAllListings = asyncHandler(async (_req, res) => {
  const items = await Item.find().populate("owner", "email");
  res.json({ items });
});

export const getAllBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find().populate("item", "title").populate("renter", "email");
  res.json({ bookings });
});

export const getAllSwaps = asyncHandler(async (_req, res) => {
  const swaps = await Swap.find()
    .populate("proposer", "email")
    .populate("receiver", "email")
    .populate("proposerItem", "title")
    .populate("receiverItem", "title");
  res.json({ swaps });
});
