import { buildResponse } from "../../../utils/response.helper.js";
import questionService from "../service/question.service.js";

class QuestionController {
  createNewQuestion = async (req, res) => {
    const data = { ...req.body };
    const result = await questionService.createNewQuestion(data);
    if (typeof result == "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Thêm câu hỏi thành công", true, {
        survey: result,
      })
    );
  };

  updateQuestionById = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    const result = await questionService.updateQuestionById(id, data);
    if (typeof result == "string")
      return res.json(buildResponse(result, false));

    return res.json(
      buildResponse("Cập nhật câu hỏi thành công", true, {
        survey: result,
      })
    );
  };
}

export default new QuestionController();
