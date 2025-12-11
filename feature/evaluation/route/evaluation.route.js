import { Router } from "express";
import upload from "../../../middleware/upload.middleware.js";
import evaluationController from "../controller/evaluation.controller.js";

const EvaluationRoute = Router();

EvaluationRoute.post(
  "/",
  upload.array("attachments"),
  evaluationController.createNewEvaluation
);
EvaluationRoute.get("/", evaluationController.getAllEvaluationsOfMember);

export default EvaluationRoute;
