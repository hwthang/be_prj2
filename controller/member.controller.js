import Account from "../model/account.model.js";
import Member from "../model/member.model.js"; // Tạo model Member tương tự Chapter
import bcryptHelper from "../utils/bcrypt.helper.js";

class MemberController {
  // Tạo mới member
  create = async (req, res) => {
    try {
      const {
        username,
        email,
        phoneNumber,
        password,
        status = "pending",
        fullName,
        dateOfBirth,
        gender,
        hometown,
        address,
        ethnicity,
        religion,
        education,
        qualification,
        politicalTheory,
        memberCode,
        joinedAt,
        position,
        chapterId,
      } = req.body;

      // Kiểm tra trùng account
      const existAccount = await Account.findOne({
        $or: [{ username }, { email }, { phoneNumber }],
      });
      if (existAccount) {
        return res
          .status(400)
          .json({ message: "Username, email hoặc số điện thoại đã tồn tại" });
      }

      // Tạo account mới
      const hashedPassword = await bcryptHelper.hashPassword(password);
      const account = new Account({
        avatar: req?.file || null,
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        status,
      });
      await account.save();

      // Tạo member mới
      const member = new Member({
        accountId: account._id,
        chapterId,
        fullName,
        dateOfBirth,
        gender,
        hometown,
        address,
        ethnicity,
        religion,
        education,
        qualification,
        politicalTheory,
        memberCode,
        joinedAt,
        position,
      });
      await member.save();

      const savedMember = await Member.findById(member._id).populate("accountId");
      return res.status(201).json(savedMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Tạo thành viên thất bại" });
    }
  };

  // Cập nhật member
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        username,
        email,
        phoneNumber,
        password,
        status,
        fullName,
        dateOfBirth,
        gender,
        hometown,
        address,
        ethnicity,
        religion,
        education,
        qualification,
        politicalTheory,
        memberCode,
        joinedAt,
        chapterId,
        position,
      } = req.body;

      const member = await Member.findById(id);
      if (!member) {
        return res.status(404).json({ message: "Thành viên không tồn tại" });
      }

      const account = await Account.findById(member.accountId);
      if (!account) {
        return res.status(404).json({ message: "Account liên kết không tồn tại" });
      }

      // Kiểm tra trùng account khác
      const existAccount = await Account.findOne({
        _id: { $ne: account._id },
        $or: [{ username }, { email }, { phoneNumber }],
      });
      if (existAccount) {
        return res
          .status(400)
          .json({ message: "Username, email hoặc số điện thoại đã tồn tại" });
      }

      // Cập nhật account
      if (username) account.username = username;
      if (email) account.email = email;
      if (phoneNumber) account.phoneNumber = phoneNumber;
      if (status) account.status = status;
      if (req.file) account.avatar = req.file;
      if (password) account.password = await bcryptHelper.hashPassword(password);
      await account.save();

      // Cập nhật member
      if (fullName) member.fullName = fullName;
      if (dateOfBirth) member.dateOfBirth = dateOfBirth;
      if (gender) member.gender = gender;
      if (hometown) member.hometown = hometown;
      if (address) member.address = address;
      if (ethnicity) member.ethnicity = ethnicity;
      if (religion) member.religion = religion;
      if (education) member.education = education;
      if (qualification) member.qualification = qualification;
      if (politicalTheory) member.politicalTheory = politicalTheory;
      if (memberCode) member.memberCode = memberCode;
      if (joinedAt) member.joinedAt = joinedAt;
       if (chapterId) member.chapterId = chapterId;
      if (position) member.position = position;

      await member.save();

      const updatedMember = await Member.findById(member._id).populate("accountId");
      return res.status(200).json(updatedMember);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Cập nhật thành viên thất bại" });
    }
  };

  // Lấy tất cả member, có thể filter theo fullName hoặc memberCode
  getAll = async (req, res) => {
    try {
      const { fullName, memberCode } = req.query;
      const filter = {};

      if (fullName) filter.fullName = { $regex: fullName, $options: "i" };
      if (memberCode) filter.memberCode = { $regex: memberCode, $options: "i" };

      const members = await Member.find(filter).populate("accountId").populate("chapterId");
      return res.status(200).json(members);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lấy danh sách thành viên thất bại" });
    }
  };

  // Lấy member theo ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const member = await Member.findById(id).populate("accountId");
      if (!member) {
        return res.status(404).json({ message: "Thành viên không tồn tại" });
      }
      return res.status(200).json(member);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lấy thành viên thất bại" });
    }
  };
}

export default new MemberController();
