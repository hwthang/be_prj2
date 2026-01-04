import Member from "../../member/model/member.model.js";
import Evaluation from "../model/evaluation.model.js";

class EvaluationService {
  createNewEvaluation = async (
    data = {
      memberId: "",
      type: "",
      title: "",
      description: "",
      attachments: [{}],
    }
  ) => {
    try {
      const isMemberExisted = await Member.findById(data?.memberId);
      if (!isMemberExisted) return "Đoàn viên chưa có trong hệ thống";
      let newEvaluation = new Evaluation(data);
      await newEvaluation.save();

      return await newEvaluation.populate({
        path: "memberId",
        populate: [{ path: "chapterId" }, { path: "accountId" }],
      });
    } catch (error) {
      // console.log(error);
      return "Lỗi khi tạo đánh giá";
    }
  };

  getAllEvaluationsOfMember = async (memberId = null) => {
    try {
      return await Evaluation.find({ memberId: memberId }).populate({
        path: "memberId",
        populate: [{ path: "chapterId" }, { path: "accountId" }],
      });
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách đánh giá";
    }
  };
}

export default new EvaluationService();
