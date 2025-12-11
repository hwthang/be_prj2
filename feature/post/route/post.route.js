import { Router } from "express";
import postController from "../controller/post.controller.js";

const PostRoute = Router()


// Tạo bài đăng mới
PostRoute.post("/", postController.createNewPost);

// Thích bài đăng
PostRoute.post("/like", postController.likePost);

// Hủy thích bài đăng
PostRoute.post("/unlike", postController.unlikePost);

// Bình luận bài đăng
PostRoute.post("/comment", postController.commentPost);

// Báo cáo bình luận
PostRoute.post("/comment/report", postController.reportComment);

// Lấy tất cả bình luận của bài đăng
PostRoute.get("/comments", postController.getAllComments);


export default PostRoute