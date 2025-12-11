import express from "express";
import surveyController from "../controller/survey.controller.js";

const SurveyRoute = express.Router();

SurveyRoute.post("", surveyController.createNewSurvey);

SurveyRoute.get("", surveyController.getAllSurveys);

SurveyRoute.get("/:id", surveyController.getSurveyById);

export default SurveyRoute;
