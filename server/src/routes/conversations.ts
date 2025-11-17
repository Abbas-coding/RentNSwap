import { Router } from "express";
import { createConversation, getConversation, getUnreadCount, listConversations, markAsRead, sendMessage } from "../controllers/conversations";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.route("/").get(listConversations).post(createConversation);
router.get("/unread-count", getUnreadCount);
router.get("/:id", getConversation);
router.patch("/:id/read", markAsRead);
router.post("/:id/messages", sendMessage);

export default router;
