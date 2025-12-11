import { buildResponse } from "../../../utils/response.helper.js";
import commentService from "../service/comment.service.js";

class CommentController {
  createNewComment = async (req, res) => {
    try {
      const data = { ...req.body, image: req.file };
      const result = await commentService.createNewComment(data);
      if (typeof result == "string")
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
      if (typeof result == "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách bình luận của bài đăng thành công", true, {
          comment: result,
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
    const { id } = req.params;
    const result = await commentService.reportComment(id);
    if (typeof result == "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Báo cáo bình luận của bài đăng thành công", true, {
        comment: result,
      })
    );
  };
}

export default new CommentController();
