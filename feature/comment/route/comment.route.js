import { Router } from "express";
import upload from "../../../middleware/upload.middleware.js";
import commentController from "../controller/comment.controller.js";

const CommentRoute = Router();

CommentRoute.post("/", commentController.createNewComment);

CommentRoute.get("/", commentController.getAllCommentsOfPost);

CommentRoute.patch("/:id", commentController.reportComment);

// ➕ Cập nhật nội dung comment
CommentRoute.put("/:id", commentController.updateComment);

// ➕ Xóa comment
CommentRoute.delete("/:id", commentController.deleteComment);

export default CommentRoute;
