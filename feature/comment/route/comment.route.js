import { Router } from "express";
import upload from "../../../middleware/upload.middleware.js";
import commentController from "../controller/comment.controller.js";

const CommentRoute = Router();

CommentRoute.post(
  "/",
  upload.single("image"),
  commentController.createNewComment
);

CommentRoute.get("/", commentController.getAllCommentsOfPost);

CommentRoute.patch("/:id", commentController.reportComment);

export default CommentRoute;
