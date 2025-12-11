import { Router } from "express";
import questionController from "../controller/question.controller.js";

const QuestionRoute = Router();

QuestionRoute.post("", questionController.createNewQuestion);
QuestionRoute.put("/:id", questionController.updateQuestionById);

export default QuestionRoute;
