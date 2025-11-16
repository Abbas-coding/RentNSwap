import { Router } from "express";
import { listItems, createItem, getItem } from "../controllers/items";
import { requireAuth, optionalAuth } from "../middleware/auth";
import upload from "../middleware/multer";

const router = Router();

router.route("/").get(optionalAuth, listItems).post(requireAuth, upload.array("images"), createItem);
router.route("/:id").get(getItem);

export default router;
