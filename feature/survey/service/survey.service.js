import Question from "../../question/model/question.model.js";
import Survey from "../model/survey.model.js";

class SurveyService {
  createNewSurvey = async (data) => {
    const newSurvey = new Survey({ ...data });
    await newSurvey.save();
    return await Survey.findById(newSurvey.id);
  };

  getAllSurveys = async () => {
    return await Survey.find().populate("chapterId");
  };
  getAllSurveysOfChapter = async (chapterId) => {
    return await Survey.find({ chapterId: chapterId }).populate("chapterId");
  };

  getSurveyById = async (id) => {
    const result = await Survey.findById(id).populate("chapterId").lean();
    const questions = await Question.find({ surveyId: id });
    return {...result,...questions};
  };
}

export default new SurveyService();
