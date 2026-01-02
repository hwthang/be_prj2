import express from "express";
import conversationController from "../controller/conversation.controller.js";

const ConversationRoute = express.Router();

/* ===== Conversation ===== */
ConversationRoute.post("/", conversationController.createConversation);
ConversationRoute.get("/my", conversationController.getMyConversations);
ConversationRoute.put(
  "/:conversationId/rename",
  conversationController.renameConversation
);
ConversationRoute.get(
  "/:conversationId/members",
  conversationController.getMembers
);
ConversationRoute.post(
  "/:conversationId/members",
  conversationController.addMember
);
ConversationRoute.delete(
  "/:conversationId/members/:accountId",
  conversationController.removeMember
);

/* ===== Message ===== */
ConversationRoute.post(
  "/:conversationId/messages",
  conversationController.sendMessage
);
ConversationRoute.get(
  "/:conversationId/messages",
  conversationController.getMessages
);
ConversationRoute.put(
  "/:conversationId/seen",
  conversationController.seenMessages
);

/* ===== Init ===== */
ConversationRoute.post(
  "/init-chapters",
  conversationController.createConversationsForChapters
);

export default ConversationRoute;
