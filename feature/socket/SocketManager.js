import { Server } from "socket.io";

class SocketManager {
  io = null;

  init(server) {
    if (this.io) return this.io;

    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      const { accountId } = socket.handshake.auth;

      if (!accountId) {
        socket.disconnect();
        return;
      }

      socket.join(accountId);

      console.log(
        `✅ User ${accountId} connected | socketId: ${socket.id}`
      );
    });

    return this.io;
  }

  getIO() {
    if (!this.io) {
      throw new Error("❌ Socket.IO not initialized");
    }
    return this.io;
  }

  
}

export default new SocketManager();
