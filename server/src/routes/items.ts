import { Router } from "express";
import { createItem, listItems, getItem } from "../controllers/items";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", listItems);
router.get("/:id", getItem);
router.post("/", requireAuth, createItem);

export default router;
