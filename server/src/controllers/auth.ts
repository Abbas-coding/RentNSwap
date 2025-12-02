import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User";
import type { AuthenticatedRequest } from "../middleware/auth";

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const normalizeIdentifier = (identifier: string) => identifier.trim().toLowerCase();
const normalizePhone = (identifier: string) => identifier.replace(/\s|-/g, "");

const buildToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
};

const formatUser = (user: IUser & { _id: any }) => ({
  id: String(user._id),
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: user.createdAt,
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400);
    throw new Error("All fields (email, password, firstName, lastName) are required");
  }

  const normalizedEmail = normalizeIdentifier(email);
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(409);
    throw new Error("Account already exists. Try logging in instead.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: normalizedEmail,
    firstName,
    lastName,
    passwordHash,
  });

  const token = buildToken(user.id);
  res.status(201).json({ token, user: formatUser(user as any) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const normalizedEmail = normalizeIdentifier(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = buildToken(user.id);
  res.json({ token, user: formatUser(user as any) });
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  res.json({ user: formatUser(req.user) });
});
