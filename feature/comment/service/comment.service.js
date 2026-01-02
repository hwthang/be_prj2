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

      await Post.findByIdAndUpdate(
        data.postId,
        { $inc: { comments: 1 } },
        { new: true }
      );

      await newComment.save();

      return await Comment.findById(newComment._id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo bình luận";
    }
  };

  getAllCommentsOfPost = async (postId) => {
    try {
      return await Comment.find({ postId }).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy bình luận";
    }
  };

  reportComment = async (id) => {
    try {
      return await Comment.findByIdAndUpdate(
        id,
        { $inc: { reports: 1 } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      return "Lỗi khi báo cáo bình luận";
    }
  };

  // 🆕 CẬP NHẬT COMMENT
  updateComment = async (id, data) => {
    try {
      const updated = await Comment.findByIdAndUpdate(
        id,
        {
          comment: data.comment,
          image: data.image,
          updatedAt: new Date(),
        },
        { new: true }
      ).populate("accountId");

      if (!updated) return "Không tìm thấy bình luận";
      return updated;
    } catch (error) {
      console.log(error);
      return "Lỗi khi cập nhật bình luận";
    }
  };

  // 🆕 XÓA COMMENT + GIẢM COUNT POST
  deleteComment = async (id) => {
    try {
      const comment = await Comment.findById(id);
      if (!comment) return "Không tìm thấy bình luận";

      await Comment.findByIdAndDelete(id);

      await Post.findByIdAndUpdate(
        comment.postId,
        { $inc: { comments: -1 } },
        { new: true }
      );

      return true;
    } catch (error) {
      console.log(error);
      return "Lỗi khi xóa bình luận";
    }
  };
}

export default new CommentService();
