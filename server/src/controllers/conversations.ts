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
    .populate("participants", "email")
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ conversations });
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

  const message = {
    sender: req.user._id,
    text,
    createdAt: new Date(),
    readBy: [req.user._id],
  };
  conversation.messages.push(message);
  await conversation.save();

  // Emit the new message to all other participants in the conversation
  conversation.participants.forEach((participant) => {
    if (participant.toString() !== req.user!._id.toString()) {
      io.to(participant.toString()).emit("new_message", { conversationId: conversation._id, message });
    }
  });

  res.status(201).json({ conversation });
});

import { io } from "../index";

export const createConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { participantId, subject, initialMessage, context } = req.body;

  if (!participantId || !subject || !initialMessage) {
    res.status(400);
    throw new Error("Missing required fields: participantId, subject, initialMessage");
  }

  // Ensure the user is not trying to create a conversation with themselves
  if (req.user._id.toString() === participantId.toString()) {
    res.status(400);
    throw new Error("Cannot create a conversation with yourself.");
  }

  // Check if a conversation with these participants already exists (ignoring subject/context)
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId] },
  });

  if (conversation) {
    // If conversation exists, just add the message
    const message = {
      sender: req.user._id,
      text: initialMessage,
      createdAt: new Date(),
      readBy: [req.user._id],
    };
    conversation.messages.push(message);
    // Optionally update the subject to reflect the most recent topic, or keep the original.
    // For now, we'll leave the subject as is to preserve the chat history context.
    await conversation.save();
    io.to(participantId).emit("new_message", { conversationId: conversation._id, message });
    res.status(200).json({ conversation });
  } else {
    // Create new conversation
    const message = {
      sender: req.user._id,
      text: initialMessage,
      createdAt: new Date(),
      readBy: [req.user._id],
    };
    conversation = await Conversation.create({
      subject,
      participants: [req.user._id, participantId],
      context,
      messages: [message],
    });
    io.to(participantId).emit("new_message", { conversationId: conversation._id, message });
    res.status(201).json({ conversation });
  }
});

export const getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    console.log("getUnreadCount: Not authenticated");
    res.status(401).json({ count: 0 });
    return;
  }

  console.log(`getUnreadCount: Checking for user ${req.user._id}`);
  const count = await Conversation.countDocuments({
    participants: req.user._id,
    "messages.sender": { $ne: req.user._id },
    "messages.readBy": { $ne: req.user._id },
  });

  console.log(`getUnreadCount: Found ${count} unread conversations`);
  res.json({ count });
});

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404).json({ message: "Conversation not found" });
    return;
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user!._id.toString()
  );
  if (!isParticipant) {
    res.status(403).json({ message: "Not authorized" });
    return;
  }

  await Conversation.updateOne(
    { _id: req.params.id, "messages.readBy": { $ne: req.user._id } },
    { $addToSet: { "messages.$[].readBy": req.user._id } }
  );

  res.status(200).json({ message: "Marked as read" });
});

