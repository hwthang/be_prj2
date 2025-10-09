import express from "express";
import userController from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const UserRoute = express.Router();

UserRoute.post("/", userController.createNewUser);
UserRoute.get("/", verifyToken, userController.getUsers);
UserRoute.get("/:username", verifyToken, userController.getUserWithUsername)
UserRoute.put("/:username", verifyToken, userController.updateUserWithUsername)
UserRoute.patch("/active/:username", userController.activeUserWithUsename)
UserRoute.patch("/lock/:username", userController.lockUserWithUsername)

export default UserRoute;
