import Account from "../../account/model/account.model.js";
import accountService from "../../account/service/account.service.js";
import Member from "../model/member.model.js";

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
      if (typeof isAccountExisted == "string") return isAccountExisted;

      const isMemberExisted = await this.checkIsMemberExisted(data);
      if (typeof isMemberExisted == "string") return isMemberExisted;

      const newAccount = new Account({
        ...data,
        displayName: data.fullName,
        type: "member",
      });
      const newMember = new Member({ ...data, accountId: newAccount.id });

      await newMember.save();
      await newAccount.save();

      return await this.getMemberById(newMember.id);
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
}

export default new MemberService();
