import Account from "../../account/model/account.model.js";
import Chapter from "../../chapter/model/chapter.model.js";
import Member from "../../member/model/member.model.js";
import SocketManager from "../../socket/SocketManager.js";
import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";

class ConversationService {
  /* =========================
     1. Tạo cuộc trò chuyện
  ========================= */
  async createConversation({ name, members }) {
    return Conversation.create({ name, members });
  }

  /* =========================
     2. Lấy danh sách cuộc trò chuyện theo accountId
  ========================= */
/* =========================
      13. Lấy hội thoại & Tự động tạo với Admin nếu chưa có
  ========================= */
  async getConversationsByAccountId(accountId) {
    // 1️⃣ Tìm tài khoản Admin hệ thống
    const admin = await Account.findOne({ type: 'admin' }).select("_id").lean();

    if (admin && admin._id.toString() !== accountId.toString()) {
      // 2️⃣ Kiểm tra xem user này đã có hội thoại với Admin chưa
      const existingWithAdmin = await Conversation.findOne({
        members: { $all: [admin._id, accountId], $size: 2 }
      });

      // 3️⃣ Nếu chưa có, tạo mới hội thoại 1-1 với Admin
      if (!existingWithAdmin) {
        await Conversation.create({
          name: "", // Chat 1-1 để trống name
          members: [admin._id, accountId]
        });
      }
    }

    // 4️⃣ Trả về danh sách hội thoại như cũ (lúc này chắc chắn đã có Admin)
    return Conversation.find({ members: accountId })
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "displayName avatar",
        },
      })
      .populate("members", "displayName avatar")
      .sort({ updatedAt: -1 })
      .lean();
  }

  /* =========================
     3. Lấy danh sách thành viên
  ========================= */
  async getMembers(conversationId) {
    const conversation = await Conversation.findById(conversationId)
      .populate("members", "displayName avatar email")
      .lean();

    if (!conversation) throw new Error("Conversation not found");
    return conversation.members;
  }

  /* =========================
     4. Thêm thành viên
  ========================= */
  async addMember(conversationId, accountId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { members: accountId } },
      { new: true }
    );
  }

  /* =========================
     5. Xóa thành viên
  ========================= */
  async removeMember(conversationId, accountId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { members: accountId } },
      { new: true }
    );
  }

  /* =========================
     6. Đổi tên cuộc trò chuyện
  ========================= */
  async renameConversation(conversationId, name) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { name },
      { new: true }
    );
  }

  /* =========================
     7. Gửi tin nhắn
  ========================= */

 async sendMessage(conversationId, { senderId, message = "", media = null }) {
  // 1️⃣ Tạo message
  const msg = await Message.create({
    conversationId,
    senderId,
    message,
    media,
    seenBy: [senderId],
  });

  // 2️⃣ Update lastMessage
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: msg._id,
  });

  // 3️⃣ Lấy conversation
  const conversation = await Conversation.findById(conversationId)
    .select("name members")
    .lean();

  if (!conversation) return msg;

  // 4️⃣ Chuẩn hóa memberIds & loại sender
  const memberIds = conversation.members.map(id => id.toString());
  const receiverIds = memberIds.filter(
    id => id !== senderId.toString()
  );

  if (receiverIds.length === 0) return msg;

  // 5️⃣ LẤY THÔNG TIN SENDER (OBJECT)
  const sender = await Account.findById(senderId)
    .select("_id displayName fullname avatar")
    .lean();

  // 6️⃣ XÁC ĐỊNH TÊN CHAT
  let chatName = conversation.name;

  // 👉 Chat 1-1 → hiện tên người gửi
  if (conversation.members.length === 2) {
    chatName = sender?.displayName || sender?.fullname || "Tin nhắn mới";
  }

  // 7️⃣ PAYLOAD TRẢ ĐÚNG FORMAT
  const payload = {
    _id: msg._id,
    conversationId,
    senderId: {
      _id: sender._id,
      displayName: sender.displayName,
      fullname: sender.fullname,
      avatar: sender.avatar,
    },
    message: msg.message,
    media: msg.media,
    seenBy: msg.seenBy,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    chatName, // 👈 để toast dùng
  };

  // 8️⃣ Emit socket
  const io = SocketManager.getIO();
  io.to(receiverIds).emit("new_message", payload);

  return payload; // 👈 trả về luôn đúng format
}


  /* =========================
     8. Đánh dấu đã xem tin nhắn
  ========================= */
  async seenMessages(conversationId, accountId) {
    await Message.updateMany(
      {
        conversationId,
        seenBy: { $ne: accountId },
      },
      { $addToSet: { seenBy: accountId } }
    );
    return true;
  }

  /* =========================
     9. Lấy danh sách tin nhắn (phân trang)
  ========================= */
  async getMessages(conversationId, { limit = 20, page = 1 }) {
    const skip = (page - 1) * limit;

    return Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "displayName avatar")
      .lean();
  }

  /* =========================
     10. Tạo conversation cho tất cả chapter
  ========================= */
  async createConversationsForAllChapters() {
    const chapters = await Chapter.find().lean();

    for (const chapter of chapters) {
      const conversation = await Conversation.create({
        name: chapter.name,
        members: [chapter.accountId],
      });

      const members = await Member.find({ chapterId: chapter._id })
        .select("accountId -_id")
        .lean();

      if (members.length > 0) {
        await Conversation.findByIdAndUpdate(conversation._id, {
          $addToSet: {
            members: { $each: members.map((m) => m.accountId) },
          },
        });
      }
    }

    return true;
  }

  /* =========================
      12. Lấy hoặc Tạo mới hội thoại 1-1
  ========================= */
  async getOrCreateConversation(senderId, receiverId) {
    // 1. Tìm cuộc hội thoại 1-1 đã tồn tại giữa 2 người
    let conversation = await Conversation.findOne({
      members: { 
        $all: [senderId, receiverId], 
        $size: 2 
      }
    })
    .populate("members", "displayName avatar")
    .populate({
      path: "lastMessage",
      populate: { path: "senderId", select: "displayName avatar" }
    })
    .lean();

    // 2. Nếu đã tồn tại, trả về luôn
    if (conversation) {
      return conversation;
    }

    // 3. Nếu chưa có, tiến hành tạo mới
    const newConversation = await Conversation.create({
      name: "", // Để trống cho chat 1-1
      members: [senderId, receiverId]
    });

    // 4. Lấy lại dữ liệu đầy đủ (populate) sau khi tạo để trả về cho Client
    return Conversation.findById(newConversation._id)
      .populate("members", "displayName avatar")
      .lean();
  }
  
}

export default new ConversationService();
