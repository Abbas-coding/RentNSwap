import { Router } from "express";
import { createSwap, listSwaps, updateSwapStatus } from "../controllers/swaps";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", listSwaps);
router.post("/", createSwap);
router.patch("/:id", updateSwapStatus);

export default router;
