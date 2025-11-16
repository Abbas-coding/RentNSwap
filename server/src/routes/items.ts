import { Router } from "express";
import { createItem, listItems, getItem } from "../controllers/items";
import { requireAuth } from "../middleware/auth";
import upload from "../middleware/multer";

const router = Router();

router.get("/", listItems);
router.get("/:id", getItem);
router.post("/", requireAuth, upload.array("images", 5), createItem);

export default router;
