import { Router } from "express";
import accountController from "../controller/account.controller.js";
import upload from "../../../middleware/upload.middleware.js";

const AccountRoute = Router();

AccountRoute.post("/create-admin", accountController.createAdmin);

AccountRoute.post("/login", accountController.login);

AccountRoute.patch("/:id/activate", accountController.activate);

AccountRoute.get("/:accountId", accountController.getAccountById);

AccountRoute.patch("/:id/inactivate", accountController.inactivate);

AccountRoute.patch("/:id/recover-password", accountController.recoverPassword);

AccountRoute.patch(
  "/:id/change-avatar",
  accountController.changeAvatar
);

export default AccountRoute;
