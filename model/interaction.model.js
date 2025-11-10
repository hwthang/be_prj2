import { Schema, SchemaType } from "mongoose";

const InteractionSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    hasLiked: { type: Boolean, default: false },
    comment: { type: String, default: null },
    address: { type: String, default: null },
  },
  { timestamps: true }
);

const Interaction = model("Interaction", InteractionSchema);

export default Interaction;
