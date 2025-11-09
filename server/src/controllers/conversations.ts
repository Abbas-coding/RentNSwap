import asyncHandler from "express-async-handler";
import type { Response } from "express";
import Conversation from "../models/Conversation";
import type { AuthenticatedRequest } from "../middleware/auth";

export const listConversations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .sort({ updatedAt: -1 })
    .lean();

  res.json({
    conversations: conversations.map((c) => ({
      _id: c._id,
      subject: c.subject,
      lastMessage: c.messages[c.messages.length - 1],
      updatedAt: c.updatedAt,
    })),
  });
});

export const getConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const conversation = await Conversation.findById(req.params.id).populate("messages.sender", "email");
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user!._id.toString()
  );
  if (!isParticipant) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json({ conversation });
});

export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("Message text required");
  }

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user!._id.toString()
  );
  if (!isParticipant) {
    res.status(403);
    throw new Error("Not authorized");
  }

  conversation.messages.push({
    sender: req.user._id,
    text,
    createdAt: new Date(),
  });
  await conversation.save();
  res.status(201).json({ conversation });
});
