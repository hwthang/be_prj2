import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    // Danh sách accountId tham gia
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
      },
    ],

    // Tin nhắn cuối cùng (để render sidebar nhanh)
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation
