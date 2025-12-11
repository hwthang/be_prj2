import { buildResponse } from "../../../utils/response.helper.js";
import answerService from "../service/answer.service.js";

class AnswerController {
  createNewAnswer = async (req, res) => {
    const data = {...req.body}

     const result = await answerService.createNewAnswer(data);
        if (typeof result == "string")
          return res.json(buildResponse(result, false));
    
        return res.json(
          buildResponse("Thêm câu trả lời thành công", true, {
            survey: result,
          })
        );
  };
}

export default new AnswerController();
