import { Server } from "socket.io";
import conversationService from "../conversation/service/conversation.service.js";
import notificationService from "../notification/service/notification.service.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Tham gia phòng conversation
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Tham gia phòng user để nhận notification
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined user room ${userId}`);
    });

    // Gửi tin nhắn realtime
    socket.on("send_message", async (data) => {
      try {
        const result = await conversationService.sendMessage(data, io);
        if (typeof result !== "string") {
          // Đã được gửi trong service
        } else {
          socket.emit("message_error", { error: result });
        }
      } catch (error) {
        socket.emit("message_error", { error: "Lỗi khi gửi tin nhắn" });
      }
    });

    // Đánh dấu tin nhắn đã xem
    socket.on("mark_message_seen", async (data) => {
      try {
        await conversationService.markAsSeen({
          accountId: data.accountId,
          targetId: data.messageId,
          type: "message",
          conversationId: data.conversationId
        }, io);
      } catch (error) {
        console.log("Error marking message as seen:", error);
      }
    });

    // Đánh dấu thông báo đã xem
    socket.on("mark_notification_seen", async (data) => {
      try {
        await notificationService.markNotificationAsSeen({
          accountId: data.accountId,
          notificationId: data.notificationId
        }, io);
      } catch (error) {
        console.log("Error marking notification as seen:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export { initializeSocket, getIO };