import { Router } from "express";
import { adminOverview, getAllBookings, getAllListings, getAllSwaps, getAllUsers } from "../controllers/admin";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/overview", adminOverview);
router.get("/users", getAllUsers);
router.get("/listings", getAllListings);
router.get("/bookings", getAllBookings);
router.get("/swaps", getAllSwaps);

export default router;
