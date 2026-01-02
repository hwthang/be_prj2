import { buildResponse } from "../../../utils/response.helper.js";
import commentService from "../service/comment.service.js";

class CommentController {
  createNewComment = async (req, res) => {
    try {
      const data = { ...req.body };
      const result = await commentService.createNewComment(data);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Tạo bình luận thành công", true, { comment: result })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi tạo bình luận", false));
    }
  };

  getAllCommentsOfPost = async (req, res) => {
    try {
      const { postId } = req.query;
      const result = await commentService.getAllCommentsOfPost(postId);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách bình luận của bài đăng thành công", true, {
          comments: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(
        buildResponse("Lỗi khi lấy danh sách bình luận của bài đăng", false)
      );
    }
  };

  reportComment = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentService.reportComment(id);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Báo cáo bình luận thành công", true, {
          comment: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi báo cáo bình luận", false));
    }
  };

  // 🆕 CẬP NHẬT COMMENT
  updateComment = async (req, res) => {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      const result = await commentService.updateComment(id, data);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Cập nhật bình luận thành công", true, {
          comment: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi cập nhật bình luận", false));
    }
  };

  // 🆕 XÓA COMMENT
  deleteComment = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentService.deleteComment(id);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Xóa bình luận thành công", true)
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi xóa bình luận", false));
    }
  };
}

export default new CommentController();
