import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Swap from "../models/Swap";
import Item from "../models/Item";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listSwaps = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const filter = req.user
    ? {
        $or: [{ proposer: req.user._id }, { receiver: req.user._id }],
      }
    : {};

  const swaps = await Swap.find(filter)
    .populate("proposer", "email")
    .populate("receiver", "email")
    .populate("proposerItem")
    .populate("receiverItem")
    .sort({ updatedAt: -1 });

  res.json({ swaps });
});

export const createSwap = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { proposerItemId, receiverItemId, receiverId, cashAdjustment = 0, notes } = req.body;
  if (!proposerItemId || !receiverItemId || !receiverId) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const proposerItem = await Item.findById(proposerItemId);
  const receiverItem = await Item.findById(receiverItemId);
  if (!proposerItem || !receiverItem) {
    res.status(404);
    throw new Error("Item not found");
  }

  const swap = await Swap.create({
    proposer: req.user._id,
    proposerItem: proposerItem._id,
    receiver: receiverId,
    receiverItem: receiverItem._id,
    cashAdjustment,
    notes,
  });

  res.status(201).json({ swap });
});

export const updateSwapStatus = asyncHandler(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "counter", "accepted", "rejected"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const swap = await Swap.findById(id);
  if (!swap) {
    res.status(404);
    throw new Error("Swap not found");
  }

  const isParticipant =
    swap.proposer.toString() === req.user._id.toString() ||
    swap.receiver.toString() === req.user._id.toString();
  if (!isParticipant) {
    res.status(403);
    throw new Error("Not authorized to update this swap");
  }

  swap.status = status;
  await swap.save();
  res.json({ swap });
});
