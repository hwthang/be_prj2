import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    type: { type: String, default: null },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
