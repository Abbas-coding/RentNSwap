import { Router } from "express";
import { createSwap, listSwaps, updateSwapStatus } from "../controllers/swaps";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", listSwaps);
router.post("/", requireAuth, createSwap);
router.patch("/:id", requireAuth, updateSwapStatus);

export default router;
