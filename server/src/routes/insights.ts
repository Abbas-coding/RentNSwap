import { Router } from "express";
import { getCommunityInsights, getOverview } from "../controllers/insights";

const router = Router();

router.get("/overview", getOverview);
router.get("/community", getCommunityInsights);

export default router;
