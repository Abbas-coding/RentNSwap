import { Router } from "express";
import { createBooking, listBookings, updateBookingStatus } from "../controllers/bookings";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", listBookings);
router.post("/", createBooking);
router.patch("/:id", updateBookingStatus);

export default router;
