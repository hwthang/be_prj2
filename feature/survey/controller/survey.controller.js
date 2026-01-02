import { buildResponse } from "../../../utils/response.helper.js";
import surveyService from "../service/survey.service.js";

class SurveyController {
  createNewSurvey = async (req, res) => {
    const data = { ...req.body };
    console.log(data);
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
        surveys: result,
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

updateSurveyById = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  const result = await surveyService.updateSurveyById(id, data);

  if (typeof result === "string")
    return res.json(buildResponse(result, false));

  return res.json(
    buildResponse("Cập nhật khảo sát thành công", true, {
      survey: result,
    })
  );
};
deleteSurveyById = async (req, res) => {
  const { id } = req.params;

  const result = await surveyService.deleteSurveyById(id);

  if (typeof result === "string")
    return res.json(buildResponse(result, false));

  return res.json(
    buildResponse("Xóa khảo sát thành công", true)
  );
};
  getSurveyResultById = async (req, res) => {
    const { id } = req.params;

    const result = await surveyService.getSurveyResultById(id);

    if (typeof result === "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Lấy kết quả khảo sát thành công", true, {
        result,
      })
    );
  };getSurveysDoneByMember = async (req, res) => {
  const { memberId } = req.params;

  if (!memberId) {
    return res.json(
      buildResponse("Thiếu memberId", false)
    );
  }

  const result = await surveyService.getSurveysDoneByMemberId(memberId);

  if (typeof result === "string") {
    return res.json(buildResponse(result, false));
  }

  return res.json(
    buildResponse(
      "Lấy danh sách khảo sát đã tham gia thành công",
      true,
      {
        surveys: result,
      }
    )
  );
};

}
export default new SurveyController();
