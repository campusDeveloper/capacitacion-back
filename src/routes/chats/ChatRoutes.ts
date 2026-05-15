import { Router } from "express";
import { ChatController } from "../../controllers/chats/ChatController";
import { AuthMiddleware as isAuth } from "../../middlewares/AuthMiddleware";

const router = Router();

router.get(
  "/opportunity/:idOpportunity/chat-messages",
  isAuth,
  ChatController.getMessagesHistory
);

export default router;