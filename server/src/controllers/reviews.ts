import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Review from "../models/Review";
import Booking from "../models/Booking";
import Item from "../models/Item";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listItemReviews = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const reviews = await Review.find({ item: itemId })
    .sort({ createdAt: -1 })
    .populate("fromUser", "email")
    .lean();

  const stats =
    reviews.length > 0
      ? {
          count: reviews.length,
          average:
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
        }
      : { count: 0, average: 0 };

  res.json({ reviews, stats });
});

export const createReview = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const { itemId, bookingId, rating, comment } = req.body;
    if (!itemId || !bookingId || !rating) {
      res.status(400);
      throw new Error("Item, booking, and rating are required");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== "completed") {
      res.status(400);
      throw new Error("You can only review completed bookings");
    }
    if (booking.item.toString() !== itemId) {
      res.status(400);
      throw new Error("Booking does not match item");
    }
    if (booking.renter.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Only renters can review this booking");
    }

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    const review = await Review.findOneAndUpdate(
      { booking: bookingId },
      {
        item: itemId,
        booking: bookingId,
        fromUser: req.user._id,
        toUser: item.owner,
        rating,
        comment,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recalculate average rating
    const allReviews = await Review.find({ item: itemId });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    item.rating = avgRating;
    await item.save();

    res.status(201).json({ review });
  }
);
