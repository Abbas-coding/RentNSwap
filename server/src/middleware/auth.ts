import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import User, { type IUser } from "../models/User";

export interface AuthenticatedRequest extends Request {
  user?: IUser & { _id: Types.ObjectId };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  try {
    const payload = jwt.verify(token, secret) as { sub: string };
    const user = (await User.findById(payload.sub)) as (IUser & { _id: Types.ObjectId }) | null;
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("--- optionalAuth middleware ---");
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log("Token found. Verifying...");
    const secret = process.env.JWT_SECRET;

    if (secret) {
      try {
        const payload = jwt.verify(token, secret) as { sub: string };
        // console.log("Token payload:", payload);
        const user = (await User.findById(payload.sub)) as (IUser & { _id: Types.ObjectId }) | null;

        if (user) {
          console.log("User found and attached to request:", user.email);
          req.user = user;
        } else {
          console.log("User ID from token not found in database.");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Invalid tokens are ignored, user remains unauthenticated
      }
    } else {
      console.log("JWT_SECRET is not configured.");
    }
  } else {
    console.log("No Authorization header found. Proceeding as unauthenticated.");
  }

  next();
};
