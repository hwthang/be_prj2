import express from "express";
import userController from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const UserRoute = express.Router();

UserRoute.post("/", userController.createNewUser);
UserRoute.get(
  "/",
  //  verifyToken,
  userController.getUsers
);
UserRoute.get("/:id", userController.getUser);
UserRoute.put(
  "/:id",
  // verifyToken,
  userController.updateUserWithUsername
);
UserRoute.patch("/active/:id", userController.activeUser);
UserRoute.patch("/lock/:id", userController.lockUser);

export default UserRoute;
