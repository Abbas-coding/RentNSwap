import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Swap from "../models/Swap";
import Item from "../models/Item";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listSwaps = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const filter = {
    $or: [{ proposer: req.user._id }, { receiver: req.user._id }],
  };

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

  if (typeof cashAdjustment !== "number" || !isFinite(cashAdjustment) || Math.abs(cashAdjustment) > 1000000) {
    res.status(400);
    throw new Error("Invalid cash adjustment amount");
  }

  const proposerItem = await Item.findById(proposerItemId);
  const receiverItem = await Item.findById(receiverItemId);
  if (!proposerItem || !receiverItem) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (String(proposerItem.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only propose swaps with items you own.");
  }

  if (String(receiverItem.owner) === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot swap with yourself.");
  }

  // Check for duplicate pending/counter swap
  const existingSwap = await Swap.findOne({
    proposer: req.user._id,
    proposerItem: proposerItemId,
    receiverItem: receiverItemId,
    status: { $in: ["pending", "counter"] },
  });

  if (existingSwap) {
    res.status(200).json({ swap: existingSwap });
    return;
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
  const { status, cashAdjustment, notes } = req.body;

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

  const isProposer = swap.proposer.toString() === req.user._id.toString();
  const isReceiver = swap.receiver.toString() === req.user._id.toString();
  if (!isProposer && !isReceiver) {
    res.status(403);
    throw new Error("Not authorized to update this swap");
  }

  if (status === "counter") {
    if (!isReceiver) {
      res.status(403);
      throw new Error("Only receivers can counter a swap request");
    }
    if (cashAdjustment !== undefined) {
      swap.cashAdjustment = cashAdjustment;
    }
    if (notes) {
      swap.notes = notes;
    }
    swap.status = "counter";
  } else if (status === "accepted") {
    if (!(isReceiver || (isProposer && swap.status === "counter"))) {
      res.status(403);
      throw new Error("Only receivers (or proposers after a counter) can accept");
    }
    swap.status = "accepted";
  } else if (status === "rejected") {
    if (!(isReceiver || isProposer)) {
      res.status(403);
      throw new Error("Not authorized");
    }
    if (notes) {
      swap.notes = notes;
    }
    swap.status = "rejected";
  } else {
    swap.status = status;
  }

  await swap.save();
  res.json({ swap });
});
