import { Router } from "express";
import { createReview, listItemReviews } from "../controllers/reviews";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/item/:itemId", listItemReviews);
router.post("/", requireAuth, createReview);

export default router;
