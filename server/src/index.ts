import "dotenv/config"; // Load env vars before anything else
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import {connectDB} from "./config/db";
import { errorHandler, notFound } from "./middleware/error";
import authRoutes from "./routes/auth";
import itemRoutes from "./routes/items";
import bookingRoutes from "./routes/bookings";
import swapRoutes from "./routes/swaps";
import reviewRoutes from "./routes/reviews";
import adminRoutes from "./routes/admin";
import insightsRoutes from "./routes/insights";
import conversationRoutes from "./routes/conversations";

// dotenv.config(); // Removed as we are using the side-effect import
connectDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",                // Keeps your local dev working
    "https://rent-n-swap.vercel.app"          // Your new production frontend
  ],
  credentials: true,                        // Important if you use cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}
));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/conversations", conversationRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://rent-n-swap.vercel.app"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join", (userId) => {
    console.log(`User ${userId} joined room`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
