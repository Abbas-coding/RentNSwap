import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Booking from "../models/Booking";
import Item from "../models/Item";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const role = (req.query.role as string) || "owner";
  const filter =
    role === "renter" ? { renter: req.user._id } : role === "all" ? {
      $or: [{ renter: req.user._id }, { owner: req.user._id }],
    } : { owner: req.user._id };

  const bookings = await Booking.find(filter)
    .sort({ startDate: 1 })
    .populate("item")
    .populate("renter", "email")
    .populate("owner", "email");

  res.json({ bookings });
});

export const createBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { itemId, startDate, endDate, deposit = 0 } = req.body;
  if (!itemId || !startDate || !endDate) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot book your own item.");
  }

  const booking = await Booking.create({
    item: item._id,
    owner: item.owner,
    renter: req.user._id,
    startDate,
    endDate,
    deposit,
  });

  res.status(201).json({ booking });
});

export const updateBookingStatus = asyncHandler(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["pending", "approved", "active", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only owners can update booking status");
  }

  booking.status = status;
  await booking.save();
  res.json({ booking });
});
