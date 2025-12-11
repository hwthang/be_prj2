import { buildResponse } from "../../../utils/response.helper.js";
import postService from "../service/post.service.js";

class PostController {
  createNewPost = async (req, res) => {
    try {
      const input = {
        title: req.body?.title,
        type: req.body?.type,
        objectId: req.body?.objectId,
      };
      const result = await postService.createNewPost(input);
      if (typeof result == "string") {
        console.log(error);
        res.json(buildResponse(result, false));
        return;
      }

      res.json(
        buildResponse("Tạo bài đăng thành công", true, { newPost: result })
      );
      return;
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi tạo bài đăng", false));
      return;
    }
  };

  likePost = async (req, res) => {
    try {
      const input = {
        postId: req.body?.postId,
        accountId: req.body?.accountId,
      };
      const result = await postService.likePost(input);
      if (typeof result == "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(
        buildResponse("Thích bài đăng thành công", true, { like: result })
      );
      return;
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi thích bài đăng", false));
      return;
    }
  };

  unlikePost = async (req, res) => {
    try {
      const input = {
        postId: req.body?.postId,
        likeId: req.body?.likeId,
      };
      const result = await postService.unlikePost(input);
      if (typeof result == "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(
        buildResponse("Hủy thích bài đăng thành công", true, { unlike: result })
      );
      return;
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi hủy thích bài đăng", false));
      return;
    }
  };

  commentPost = async (req, res) => {
    try {
      const input = {
        postId: req.body?.postId,
        accountId: req.body?.accountId,
        comment: req.body?.comment,
      };
      const result = await postService.commentPost(input);
      if (typeof result == "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(
        buildResponse("Bình luận thành công", true, { comment: result })
      );
      return;
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi bình luận bài đăng", false));
      return;
    }
  };

  reportComment = async (req, res) => {
    try {
      const id = req.body?.commentId;
      const result = await postService.reportComment(id);
      if (typeof result == "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(
        buildResponse("Báo cáo bình luận thành công", true, { report: result })
      );
      return;
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi báo cáo bình luận", false));
      return;
    }
  };

  getAllComments = async (req, res) => {
    try {
      const input = {
        postId: req.query?.postId,
      };
      const result = await postService.getAllComments(input);
      if (typeof result == "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(
        buildResponse("Lấy danh sách bình luận thành công", true, {
          comments: result,
        })
      );
      return;
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi lấy danh sách bình luận", false));
      return;
    }
  };
}

export default new PostController();
