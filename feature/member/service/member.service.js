import mongoose from "mongoose";
import Account from "../../account/model/account.model.js";
import accountService from "../../account/service/account.service.js";
import Chapter from "../../chapter/model/chapter.model.js";
import Conversation from "../../conversation/model/conversation.model.js";
import Member from "../model/member.model.js";
import Attendance from "../../attendance/model/attendance.model.js";
import Answer from "../../answer/model/answer.model.js";
import Question from "../../question/model/question.model.js";

class MemberService {
  checkIsMemberExisted = async (
    member = { chapterId: "", memberCode: "" },
    excludedId = null
  ) => {
    const queryExclude = excludedId ? { _id: { $ne: excludedId } } : {};

    if (
      await Member.findOne({
        chapterId: member.chapterId,
        memberCode: member.memberCode,
        ...queryExclude,
      })
    )
      return `Chi đoàn này đã tồn tại đoàn viên có số thẻ đoàn ${member.memberCode}`;

    return false;
  };

  createNewMember = async (
    data = {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      chapterId: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      hometown: "",
      address: "",
      ethnicity: "",
      religion: "",
      education: "",
      qualification: "",
      politicalTheory: "",
      memberCode: "",
      joinedAt: "",
      position: "",
    }
  ) => {
    try {
      const isAccountExisted = await accountService.checkIsAccountExisted(data);
      if (typeof isAccountExisted === "string") return isAccountExisted;

      const isMemberExisted = await this.checkIsMemberExisted(data);
      if (typeof isMemberExisted === "string") return isMemberExisted;

      // 1️⃣ Tạo account member
      const newAccount = new Account({
        ...data,
        displayName: data.fullName,
        type: "member",
      });

      await newAccount.save();

      // 2️⃣ Tạo member
      const newMember = new Member({
        ...data,
        accountId: newAccount._id,
      });

      await newMember.save();

      // 3️⃣ LẤY CHAPTER
      const chapter = await Chapter.findById(data.chapterId)
        .select("name accountId")
        .lean();

      if (!chapter) {
        throw new Error("Chapter not found");
      }

      // 4️⃣ TÌM GROUP CHAT CỦA CHAPTER
      const conversation = await Conversation.findOne({
        name: `Nhóm chat ${chapter.name}`,
        members: { $in: [chapter.accountId] }, // 👈 đảm bảo là group của chapter
      });

      if (conversation) {
        await Conversation.findByIdAndUpdate(conversation._id, {
          $addToSet: { members: newAccount._id },
        });
      }

      return await this.getMemberById(newMember._id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo đoàn viên";
    }
  };

  getAllMembers = async () => {
    try {
      const members = await Member.find()
        .populate("accountId")
        .populate("chapterId");

      return members;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách đoàn viên";
    }
  };

  getAllMembersOfChapter = async (chapterId) => {
    try {
      const members = await Member.find({ chapterId: chapterId })
        .populate("accountId")
        .populate("chapterId");

      return members;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách đoàn viên";
    }
  };

  getMemberById = async (id) => {
    try {
      const member = await Member.findById(id)
        .populate("accountId")
        .populate("chapterId");

      return member;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy thông tin đoàn viên";
    }
  };

  updateMemberById = async (
    id,
    data = {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      chapterId: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      hometown: "",
      address: "",
      ethnicity: "",
      religion: "",
      education: "",
      qualification: "",
      politicalTheory: "",
      memberCode: "",
      joinedAt: "",
      position: "",
    }
  ) => {
    try {
      const currentMember = await Member.findById(id);
      const isAccountExisted = await accountService.checkIsAccountExisted(
        data,
        currentMember.accountId
      );
      if (typeof isAccountExisted == "string") return isAccountExisted;

      const isMemberExisted = await this.checkIsMemberExisted(data, id);
      if (typeof isMemberExisted == "string") return isMemberExisted;

      await Account.findByIdAndUpdate(
        currentMember.accountId,
        { ...data, displayName: data.fullName },
        { new: true }
      );

      await Member.findByIdAndUpdate(id, { ...data }, { new: true });

      return await this.getMemberById(id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo đoàn viên";
    }
  };


getLeaderBoard = async (chapterId) => {
  if (!chapterId) return "Thiếu chapterId";

  const chapterObjectId = new mongoose.Types.ObjectId(chapterId);

  /* =======================
     1️⃣ LẤY DANH SÁCH ĐOÀN VIÊN
  ======================= */
  const members = await Member.find({ chapterId: chapterObjectId })
    .select("_id fullName")
    .lean();

  if (!members.length) return [];

  const memberIds = members.map((m) => m._id);

  /* =======================
     2️⃣ TÍNH SỐ HOẠT ĐỘNG ĐÃ THAM GIA
     +5 / activity
  ======================= */
  const activityStats = await Attendance.aggregate([
    {
      $match: {
        memberId: { $in: memberIds },
        status: "attended",
      },
    },
    {
      $group: {
        _id: "$memberId",
        totalActivities: { $sum: 1 },
      },
    },
  ]);

  const activityMap = {};
  activityStats.forEach((a) => {
    activityMap[a._id.toString()] = a.totalActivities;
  });

  /* =======================
     3️⃣ TÍNH SỐ KHẢO SÁT ĐÃ LÀM
     (theo logic Answer → Question → Survey)
     +3 / survey
  ======================= */

  // 3.1 Lấy toàn bộ answer của các member
  const answers = await Answer.find({
    memberId: { $in: memberIds },
  })
    .select("memberId questionId")
    .lean();

  let surveyCountMap = {};

  if (answers.length) {
    // 3.2 Lấy danh sách questionId duy nhất
    const questionIds = [
      ...new Set(
        answers
          .map((a) => a.questionId?.toString())
          .filter(Boolean)
      ),
    ];

    // 3.3 Truy ngược question → surveyId
    const questions = await Question.find({
      _id: { $in: questionIds },
    })
      .select("surveyId")
      .lean();

    const questionToSurveyMap = {};
    questions.forEach((q) => {
      if (q.surveyId) {
        questionToSurveyMap[q._id.toString()] = q.surveyId.toString();
      }
    });

    // 3.4 memberId → Set<surveyId>
    const memberSurveySetMap = {};

    answers.forEach((a) => {
      const memberId = a.memberId.toString();
      const surveyId = questionToSurveyMap[a.questionId?.toString()];
      if (!surveyId) return;

      if (!memberSurveySetMap[memberId]) {
        memberSurveySetMap[memberId] = new Set();
      }

      memberSurveySetMap[memberId].add(surveyId);
    });

    // 3.5 Convert Set → count
    Object.entries(memberSurveySetMap).forEach(([memberId, surveySet]) => {
      surveyCountMap[memberId] = surveySet.size;
    });
  }

  /* =======================
     4️⃣ GHÉP DATA + TÍNH ĐIỂM
  ======================= */
  const leaderboard = members.map((member) => {
    const memberId = member._id.toString();

    const totalActivities = activityMap[memberId] || 0;
    const totalSurveys = surveyCountMap[memberId] || 0;

    const activityScore = totalActivities * 5;
    const surveyScore = totalSurveys * 3;

    return {
      memberId: member._id,
      fullName: member.fullName,
      activities: totalActivities,
      surveys: totalSurveys,
      score: activityScore + surveyScore,
    };
  });

  /* =======================
     5️⃣ SORT GIẢM DẦN THEO ĐIỂM
  ======================= */
  leaderboard.sort((a, b) => b.score - a.score);

  return leaderboard;
};

}

export default new MemberService();
