import { buildResponse } from "../../../utils/response.helper.js";
import surveyService from "../service/survey.service.js";

class SurveyController {
  createNewSurvey = async (req, res) => {
    const data = { ...req.body };
    const result = await surveyService.createNewSurvey(data);
    if (typeof result == "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Tạo khảo sát thành công", true, {
        survey: result,
      })
    );
  };

  getAllSurveys = async (req, res) => {
    const { chapterId } = req.query;
    const result = chapterId
      ? await surveyService.getAllSurveysOfChapter(chapterId)
      : await surveyService.getAllSurveys();
    if (typeof result == "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Lấy danh sách khảo sát thành công", true, {
        survey: result,
      })
    );
  };

  getSurveyById = async (req, res) => {
    const { id } = req.params;
    const result = await surveyService.getSurveyById(id);
    if (typeof result == "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Lấy thông tin khảo sát thành công", true, {
        survey: result,
      })
    );
  };
}
export default new SurveyController();
