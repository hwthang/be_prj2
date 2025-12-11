import Post from "../../post/model/post.model.js";
import Like from "../model/like.model.js";

class LikeService {
  createLike = async (
    data = {
      postId: "",
      accountId: "",
    }
  ) => {
    const newLike = new Like({ ...data });
    await Post.findByIdAndUpdate(
      data.postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    await newLike.save();
    return newLike;
  };

  deleteLike = async (
    data = {
      postId: "",
      accountId: "",
    }
  ) => {
    await Post.findByIdAndUpdate(
      data.postId,
      { $dec: { likes: -1 } },
      { new: true }
    );
    return await Like.findOneAndDelete({ ...data });
  };
}

export default new LikeService();
