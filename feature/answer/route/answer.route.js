import { Router } from "express";
import answerController from "../controller/answer.controller.js";

const AnswerRoute = Router();

AnswerRoute.post("", answerController.createNewAnswer);

export default AnswerRoute;
