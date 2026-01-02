import Answer from "../../answer/model/answer.model.js";
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
    return { ...result, ...questions };
  };

  updateSurveyById = async (id, data) => {
    const updatedSurvey = await Survey.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    ).populate("chapterId");

    return updatedSurvey;
  };
  deleteSurveyById = async (id) => {
    // Xóa survey
    await Survey.findByIdAndDelete(id);

    // Xóa toàn bộ câu hỏi thuộc survey
    await Question.deleteMany({ surveyId: id });

    return true;
  };
  getSurveyResultById = async (surveyId) => {
    const survey = await Survey.findById(surveyId).populate("chapterId").lean();
    if (!survey) return "Không tìm thấy khảo sát";

    const questions = await Question.find({ surveyId }).lean();

    // TỐI ƯU 1: Tạo Map để tìm kiếm câu hỏi với tốc độ O(1)
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    const questionIds = questions.map((q) => q._id);

    // const answers = await Answer.find({
    //   questionId: { $in: questionIds },
    // })
    //   .populate("memberId")
    //   .sort({ createdAt: 1 })
    //   .lean();

    const answers = await Answer.find({
      questionId: { $in: questionIds },
    }).populate({
      path: "memberId",
      populate: {
        path: "accountId",
      },
    });

    console.log(answers);
    const resultByMember = {};

    for (const ans of answers) {
      const memberKey = ans.memberId?._id?.toString();
      console.log(memberKey);
      if (!memberKey) continue;

      const question = questionMap[ans.questionId.toString()];
      if (!question) continue;

      if (!resultByMember[memberKey]) {
        resultByMember[memberKey] = {
          member: ans.memberId,
          completedAt: ans.createdAt,
          // TỐI ƯU 2: Dùng Map thay vì Array để cố định vị trí câu hỏi
          answersMap: {},
        };
      }

      resultByMember[memberKey].completedAt = ans.createdAt;

      let formattedAnswer = null;
      if (question.type === "text") {
        formattedAnswer = ans.text;
      } else if (ans.options) {
        // TỐI ƯU 3: Ép kiểu Number để map đáp án chính xác
        formattedAnswer = ans.options.map(
          (idx) => question.options[Number(idx)]
        );
      }

      resultByMember[memberKey].answersMap[question._id.toString()] = {
        questionId: question._id,
        question: question.question,
        type: question.type,
        answer: formattedAnswer,
      };
    }

    // TỐI ƯU 4: Chuyển đổi answersMap về Array theo đúng thứ tự câu hỏi gốc
    const finalResults = Object.values(resultByMember).map((memberRecord) => {
      return {
        ...memberRecord,
        answers: questions.map(
          (q) =>
            memberRecord.answersMap[q._id.toString()] || {
              questionId: q._id,
              question: q.question,
              type: q.type,
              answer: "Không trả lời",
            }
        ),
        answersMap: undefined, // Xóa Map tạm
      };
    });

    return {
      survey: {
        id: survey._id,
        name: survey.name,
        chapter: survey.chapterId,
        startedAt: survey.startedAt,
        endedAt: survey.endedAt,
        status: calculateSurveyStatus(survey),
      },
      totalParticipants: finalResults.length,
      results: finalResults,
    };
  };
  getSurveysDoneByMemberId = async (memberId) => {
    if (!memberId) return "Thiếu memberId";

    /* =======================
      1. Lấy toàn bộ answer của member
  ======================= */
    const answers = await Answer.find({ memberId })
      .select("questionId createdAt")
      .lean();

    if (!answers.length) {
      return [];
    }

    /* =======================
      2. Lấy danh sách questionId
  ======================= */
    const questionIds = [
      ...new Set(answers.map((a) => a.questionId?.toString()).filter(Boolean)),
    ];

    /* =======================
      3. Truy ngược question → surveyId
  ======================= */
    const questions = await Question.find({
      _id: { $in: questionIds },
    })
      .select("surveyId")
      .lean();

    /* =======================
      4. Dùng Set để lấy surveyId duy nhất
  ======================= */
    const surveyIdSet = new Set();

    questions.forEach((q) => {
      if (q.surveyId) {
        surveyIdSet.add(q.surveyId.toString());
      }
    });

    const surveyIds = [...surveyIdSet];

    if (!surveyIds.length) {
      return [];
    }

    /* =======================
      5. Lấy metadata survey
  ======================= */
    const surveys = await Survey.find({
      _id: { $in: surveyIds },
    })
      .populate("chapterId")
      .select("name startedAt endedAt status chapterId createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return surveys;
  };
}

export default new SurveyService();
const calculateSurveyStatus = (survey) => {
  const now = new Date();

  const startedAt = survey.startedAt
    ? new Date(survey.startedAt)
    : new Date(survey.createdAt);

  const endedAt = survey.endedAt ? new Date(survey.endedAt) : null;

  if (now < startedAt) return "upcoming";

  if (endedAt && now > endedAt) return "ended";

  return "ongoing";
};
