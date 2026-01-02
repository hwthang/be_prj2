import { Router } from "express";
import likeController from "../controller/like.controller.js";

const LikeRoute = Router();

LikeRoute.post("/", likeController.createLike);
LikeRoute.delete("/", likeController.deleteLike);

LikeRoute.get("/:accountId", likeController.getLikeEvent);

export default LikeRoute;
