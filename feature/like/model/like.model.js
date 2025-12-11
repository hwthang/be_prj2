import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", LikeSchema);

export default Like;
