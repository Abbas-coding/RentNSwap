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

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400);
    throw new Error("Invalid date format");
  }

  if (start < now) {
    res.status(400);
    throw new Error("Start date cannot be in the past");
  }

  if (end <= start) {
    res.status(400);
    throw new Error("End date must be after start date");
  }

  if (start.getFullYear() > 2100 || end.getFullYear() > 2100) {
    res.status(400);
    throw new Error("Date is too far in the future");
  }

  if (typeof deposit !== "number" || !isFinite(deposit) || deposit < 0 || deposit > 1000000) {
    res.status(400);
    throw new Error("Invalid deposit amount");
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

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    item: itemId,
    status: { $in: ["approved", "active"] },
    $or: [
      { startDate: { $lt: end }, endDate: { $gt: start } }, // Classic overlap logic
    ],
  });

  if (overlappingBooking) {
    res.status(409);
    throw new Error("Item is already booked for these dates");
  }

  // Check for duplicate pending request from same user
  const duplicateRequest = await Booking.findOne({
    item: itemId,
    renter: req.user._id,
    status: "pending",
    startDate: start,
    endDate: end,
  });

  if (duplicateRequest) {
    // If a pending request matches exactly, return it instead of creating a new one (idempotency)
    res.status(200).json({ booking: duplicateRequest });
    return;
  }

  const booking = await Booking.create({
    item: item._id,
    owner: item.owner,
    renter: req.user._id,
    startDate: start,
    endDate: end,
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
