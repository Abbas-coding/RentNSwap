import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri);
    const { host } = mongoose.connection;
    console.log(`✅ MongoDB connected: ${host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }
}
