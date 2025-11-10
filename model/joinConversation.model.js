import { model, Schema } from "mongoose";

const JoinConversationSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    name: { type: String, default: null },
    isLeader: { type: Boolean, default: false },
    canSend: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const JoinConversation = model("JoinConversation", JoinConversationSchema);

export default JoinConversation;
