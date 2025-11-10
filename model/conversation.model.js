import { model, Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    name: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;
