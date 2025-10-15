import express from "express";
import userController from "../controller/user.controller.js";
import upload from "../middleware/upload.middleware.js";


const UserRoute = express.Router();

/**
 * 🧩 Account Routes
 * Base path: /api/users
 */

UserRoute.post("/", userController.createUser);

UserRoute.get("/", userController.getUsers );

UserRoute.get("/:id", userController.getUser);

UserRoute.put("/:id", userController.updateUser );

UserRoute.patch("/:id/active", userController.activeUser);

UserRoute.patch("/:id/lock", userController.lockUser);

UserRoute.patch("/:id/update-avatar",upload.single("avatar"), userController.updateAvatar)

export default UserRoute;
