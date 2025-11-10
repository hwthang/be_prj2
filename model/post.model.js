import { model, Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, default: null },
    hashTags: { type: Array, default: null },
    type: { type: String, default: null },
    likes: { type: Int32Array, default: 0 },
    comments: { type: Int32Array, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", PostSchema);

export default Post;
