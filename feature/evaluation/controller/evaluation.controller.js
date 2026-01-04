import { buildResponse } from "../../../utils/response.helper.js";
import evaluationService from "../service/evaluation.service.js";

class EvaluationController {
  createNewEvaluation = async (req, res) => {
    try {
      const data = {
        memberId: req.body?.memberId,
        type: req.body?.type,
        title: req.body?.title,
        description: req.body?.description,
        attachments: req?.body?.attachments,
      };

      // console.log(data)

      const result = await evaluationService.createNewEvaluation(data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Tạo đánh giá đoàn viên thành công", true, {
          evaluation: result,
        })
      );
    } catch (error) {
      // console.log(error.message);
      return res.json(buildResponse("Lỗi khi tạo đánh giá đoàn viên", false));
    }
  };

  getAllEvaluationsOfMember = async (req, res) => {
    try {
      const { memberId } = req.query;
      const result = await evaluationService.getAllEvaluationsOfMember(
        memberId
      );

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách đánh giá đoàn viên thành công", true, {
          evaluations: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(
        buildResponse("Lỗi khi lấy danh sách đánh giá đoàn viên", false)
      );
    }
  };
}

export default new EvaluationController();
