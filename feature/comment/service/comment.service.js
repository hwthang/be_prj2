import Post from "../../post/model/post.model.js";
import Comment from "../model/comment.model.js";

class CommentService {
  createNewComment = async (
    data = {
      postId: null,
      accountId: null,
      text: null,
      image: null,
    }
  ) => {
    try {
      const newComment = new Comment({ ...data });
      await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } }, { new: true });
      await newComment.save();
      return await Comment.findById(newComment.id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo bình luận";
    }
  };

  getAllCommentsOfPost = async (postId) => {
    return await Comment.find({ postId: postId }).populate("accountId");
  };

  reportComment = async (id) => {
    return await Comment.findByIdAndUpdate(
      id,
      { $inc: { reports: 1 } },
      { new: true }
    );
  };
}

export default new CommentService();
