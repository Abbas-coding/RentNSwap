import { Router } from "express";
import { getConversation, listConversations, sendMessage } from "../controllers/conversations";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", listConversations);
router.get("/:id", getConversation);
router.post("/:id/messages", sendMessage);

export default router;
