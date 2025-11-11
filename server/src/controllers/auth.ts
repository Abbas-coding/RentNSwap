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

const formatUser = (user: IUser) => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body as { identifier?: string; password?: string };

  if (!identifier || !password) {
    res.status(400);
    throw new Error("Identifier and password are required");
  }

  const identifierIsEmail = isEmail(identifier);
  const normalizedValue = identifierIsEmail
    ? normalizeIdentifier(identifier)
    : normalizePhone(identifier);

  const query = identifierIsEmail ? { email: normalizedValue } : { phone: normalizedValue };
  const existingUser = await User.findOne(query);
  if (existingUser) {
    res.status(409);
    throw new Error("Account already exists. Try logging in instead.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: identifierIsEmail ? normalizedValue : undefined,
    phone: identifierIsEmail ? undefined : normalizedValue,
    passwordHash,
  });

  const token = buildToken(user.id);
  res.status(201).json({ token, user: formatUser(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body as { identifier?: string; password?: string };

  if (!identifier || !password) {
    res.status(400);
    throw new Error("Identifier and password are required");
  }

  const identifierIsEmail = isEmail(identifier);
  const normalizedValue = identifierIsEmail
    ? normalizeIdentifier(identifier)
    : normalizePhone(identifier);

  const query = identifierIsEmail ? { email: normalizedValue } : { phone: normalizedValue };
  const user = await User.findOne(query);

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
  res.json({ token, user: formatUser(user) });
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  res.json({ user: formatUser(req.user) });
});
