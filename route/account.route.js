// routes/AccountRoute.js
import { Router } from "express";
import accountController from "../controller/account.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.post("/", upload.single("avatar"), accountController.create);
router.get("/", accountController.getAll);
router.get("/:id", accountController.getOne);
router.put("/:id", upload.single("avatar"), accountController.update);
router.patch("/activate/:id",  accountController.activate);
router.patch("/lock/:id",  accountController.lock);
router.delete("/:id", accountController.delete);

export default router;
