import { Router } from "express";
import { createItem, listItems } from "../controllers/items";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", listItems);
router.post("/", requireAuth, createItem);

export default router;
