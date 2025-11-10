import { model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    text: { type: String, default: null },
    file: { type: Object, default: null },
    image: { type: Object, default: null },
    seenId: {  type: Schema.Types.ObjectId,
      ref: "Seen",
      default: null, },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", MessageSchema);

export default Message;
