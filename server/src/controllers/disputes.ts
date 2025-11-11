import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Dispute from "../models/Dispute";
import Booking from "../models/Booking";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listDisputes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const filter =
    req.user.role === "admin"
      ? {}
      : {
          raisedBy: req.user._id,
        };

  const disputes = await Dispute.find(filter)
    .populate("booking", "item renter owner status")
    .sort({ updatedAt: -1 });

  res.json({ disputes });
});

export const createDispute = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { bookingId, description } = req.body;
  if (!bookingId || !description) {
    res.status(400);
    throw new Error("Booking and description required");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (
    booking.renter.toString() !== req.user._id.toString() &&
    booking.owner.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You can only dispute your own bookings");
  }

  const dispute = await Dispute.create({
    booking: booking._id,
    raisedBy: req.user._id,
    description,
  });

  res.status(201).json({ dispute });
});

export const updateDispute = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  const { id } = req.params;
  const { status, resolution, adminDecision } = req.body;

  const dispute = await Dispute.findById(id);
  if (!dispute) {
    res.status(404);
    throw new Error("Dispute not found");
  }

  if (status) dispute.status = status;
  if (resolution) dispute.resolution = resolution;
  if (adminDecision) dispute.adminDecision = adminDecision;
  await dispute.save();

  res.json({ dispute });
});
