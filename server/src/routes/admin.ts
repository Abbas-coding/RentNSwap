import { Router } from "express";
import { adminOverview } from "../controllers/admin";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/overview", adminOverview);

export default router;
