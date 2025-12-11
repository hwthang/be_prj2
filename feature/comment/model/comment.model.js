import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    comment: { type: String, default: null },
    image: { type: Object, default: null },
    reports: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
