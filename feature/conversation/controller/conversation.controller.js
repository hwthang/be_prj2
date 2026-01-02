import conversationService from "../service/conversation.service.js";

class ConversationController {
  static async createConversation(req, res) {
    try {
      const { name, members } = req.body;
      if (!members || members.length === 0) {
        return res.status(400).json({ error: "Thiếu members" });
      }

      const conversation = await conversationService.createConversation({
        name,
        members,
      });

      res.json({ success: true, conversation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMyConversations(req, res) {
    try {
      const { accountId } = req.query;
      if (!accountId) {
        return res.status(400).json({ error: "Thiếu accountId" });
      }

      const conversations =
        await conversationService.getConversationsByAccountId(accountId);

      res.json({ success: true, conversations });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async renameConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const { name } = req.body;

      const conversation =
        await conversationService.renameConversation(conversationId, name);

      res.json({ success: true, conversation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMembers(req, res) {
    try {
      const { conversationId } = req.params;
      const members = await conversationService.getMembers(conversationId);
      res.json({ success: true, members });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addMember(req, res) {
    try {
      const { conversationId } = req.params;
      const { accountId } = req.body;

      const conversation =
        await conversationService.addMember(conversationId, accountId);

      res.json({ success: true, conversation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeMember(req, res) {
    try {
      const { conversationId, accountId } = req.params;

      const conversation =
        await conversationService.removeMember(conversationId, accountId);

      res.json({ success: true, conversation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { senderId, message, media } = req.body;

      const msg = await conversationService.sendMessage(conversationId, {
        senderId,
        message,
        media,
      });

      res.json({ success: true, message: msg });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { limit, page } = req.query;

      const messages = await conversationService.getMessages(conversationId, {
        limit: Number(limit),
        page: Number(page),
      });

      res.json({ success: true, messages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async seenMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { accountId } = req.body;

      await conversationService.seenMessages(conversationId, accountId);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createConversationsForChapters(req, res) {
    try {
      await conversationService.createConversationsForAllChapters();
      res.json({
        success: true,
        message: "Tạo conversation cho tất cả chapter thành công",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // PATCH /api/conversations/:conversationId/seen
async seenConversation(req, res) {
  const { conversationId } = req.params;
  const { accountId } = req.body;

  await ConversationService.markConversationAsSeen(
    conversationId,
    accountId
  );

  res.json({
    success: true,
    message: "Seen conversation",
  });
}

}

export default ConversationController;
