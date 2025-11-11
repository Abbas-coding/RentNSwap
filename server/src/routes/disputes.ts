import { Router } from "express";
import { createDispute, listDisputes, updateDispute } from "../controllers/disputes";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.use(requireAuth);
router.get("/", listDisputes);
router.post("/", createDispute);
router.patch("/:id", requireAdmin, updateDispute);

export default router;
