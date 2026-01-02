import express from "express";
import surveyController from "../controller/survey.controller.js";

const SurveyRoute = express.Router();

SurveyRoute.post("", surveyController.createNewSurvey);

SurveyRoute.get("", surveyController.getAllSurveys);

SurveyRoute.get("/:id", surveyController.getSurveyById);


SurveyRoute.put("/:id", surveyController.updateSurveyById);
SurveyRoute.delete("/:id", surveyController.deleteSurveyById);
SurveyRoute.get(
  "/:id/results",
  surveyController.getSurveyResultById
);
SurveyRoute.get(
  "/member/:memberId",
  surveyController.getSurveysDoneByMember
);

export default SurveyRoute;
