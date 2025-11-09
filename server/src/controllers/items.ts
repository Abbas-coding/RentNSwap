import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Item from "../models/Item";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listItems = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const query: Record<string, unknown> = {};
  if (category) query.category = category;
  if (featured === "true") {
    query.tags = { $in: ["featured"] };
  }

  const items = await Item.find(query).populate("owner", "email phone");
  res.json({ items });
});

export const createItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const {
    title,
    category,
    description,
    pricePerDay,
    deposit = 0,
    location,
    swapEligible = false,
    tags = [],
  } = req.body;

  if (!title || !category || !description || !pricePerDay || !location) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const item = await Item.create({
    owner: req.user._id,
    title,
    category,
    description,
    pricePerDay,
    deposit,
    location,
    swapEligible,
    tags,
    availability: req.body.availability ?? [],
    images: req.body.images ?? [],
  });

  res.status(201).json({ item });
});
