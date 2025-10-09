import User from "../model/user.model.js";
import bcryptHelper from "../utils/bcrypt.helper.js";
import chapterService from "./chapter.service.js";

const ROLE = ["admin", "manager", "member"];
const GENDER = ["male", "female"];
const POSITION = ["bi_thu", "pho_bi_thu", "doan_vien"];

class UserService {
  isValidUsername = (username) => {
    if (!username) return false;
    return true;
  };

  isValidEmail = (email) => {
    if (!email) return false;
    return true;
  };

  isValidPhone = (phone) => {
    if (!phone) return false;
    return true;
  };

  isValidPassword = (password) => {
    if (!password) return false;
    return true;
  };

  isValidRole = (role) => {
    if (ROLE.includes(role)) return true;
    return false;
  };

  isValidFullname = (fullname) => {
    if (!fullname) return false;
    return true;
  };

  isValidBirthdate = (date) => {
    if (!date) return false;
    return true;
  };

  isValidGender = (gender) => {
    if (!GENDER.includes(gender)) return false;
    return true;
  };

  isValidAddress = (address) => {
    if (!address) return false;
    return true;
  };

  isValidCardCode = (code) => {
    if (!code) return false;
    return true;
  };

  isValidJoinedDate = (date) => {
    if (!date) return false;
    return true;
  };

  isValidPosition = (position) => {
    if (!POSITION.includes(position)) return false;
    return true;
  };

  getUserWithKey = async (key) => {
    return await User.findOne(key);
  };

  getUsersForAdmin = async (options) => {
    const { search, role, status, limit = 10, page = 1 } = options;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    // Tìm kiếm username hoặc fullname
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [{ username: searchRegex }, { fullname: searchRegex }];
    }

    // Paging
    const skip = (page - 1) * limit;

    // Lấy dữ liệu
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      // .select("username email role status fullname avatar")
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    // Tổng số bản ghi (nếu cần để paging)
    const total = await User.countDocuments(filter);

    return { total, users };
  };

  getUsersForManager = async (chapterCode, options) => {
    const { search, status, limit = 10, page = 1 } = options;

    const chapter = await chapterService.getChapterWithKey({
      chapterCode: chapterCode,
    });

    const filter = {};

    filter.chapterCode = chapter.chapterCode;
    filter.role = "member";
    if (status) filter.status = status;

    // Tìm kiếm username hoặc fullname
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.fullname = searchRegex;
    }

    // Paging
    const skip = (page - 1) * limit;

    // Lấy dữ liệu
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      // .select("avatar fullname gender birthdate position status")
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    // Tổng số bản ghi (nếu cần để paging)
    const total = await User.countDocuments(filter);

    return { total, users };
  };
  isValidAdmin = async (input, isUpdating = false) => {
    const { username, email, phone, password } = input;

    if (!isUpdating || username) {
      if (!this.isValidUsername(username)) return "Tên người dùng không hợp lệ";
      if (await this.getUserWithKey({ username }))
        return "Tên người dùng đã được sử dụng";
    }

    if (!isUpdating || email) {
      if (!this.isValidEmail(email)) return "Email không hợp lệ";
      if (await this.getUserWithKey({ email })) return "Email đã được sử dụng";
    }

    if (!isUpdating || phone) {
      if (!this.isValidPhone(phone)) return "Số điện thoại không hợp lệ";
      if (await this.getUserWithKey({ phone }))
        return "Số điện thoại đã được sử dụng";
    }

    if (!isUpdating || password) {
      if (!this.isValidPassword(password)) return "Mật khẩu không hợp lệ";
    }

    return true; // hợp lệ
  };

  isValidManager = async (input, isUpdating = false) => {
    const { username, password } = input;

    if (!isUpdating || username) {
      if (!this.isValidUsername(username)) return "Tên người dùng không hợp lệ";
      if (await this.getUserWithKey({ username }))
        return "Tên người dùng đã được sử dụng";
    }

    if (!isUpdating || password) {
      if (!this.isValidPassword(password)) return "Mật khẩu không hợp lệ";
    }

    return true;
  };

  isValidMember = async (input, isUpdating = false) => {
    const {
      username,
      email,
      phone,
      password,
      fullname,
      birthdate,
      gender,
      address,
      cardCode,
      joinedDate,
      chapterCode,
    } = input;

    if (!isUpdating || username) {
      if (!this.isValidUsername(username)) return "Tên người dùng không hợp lệ";
      if (await this.getUserWithKey({ username }))
        return "Tên người dùng đã được sử dụng";
    }

    if (!isUpdating || email) {
      if (!this.isValidEmail(email)) return "Email không hợp lệ";
      if (await this.getUserWithKey({ email })) return "Email đã được sử dụng";
    }

    if (!isUpdating || phone) {
      if (!this.isValidPhone(phone)) return "Số điện thoại không hợp lệ";
      if (await this.getUserWithKey({ phone }))
        return "Số điện thoại đã được sử dụng";
    }

    if (!isUpdating || fullname) {
      if (!this.isValidFullname(fullname)) return "Họ và tên không hợp lệ";
    }

    if (!isUpdating || birthdate) {
      if (!this.isValidBirthdate(birthdate)) return "Ngày sinh không hợp lệ";
    }

    if (!isUpdating || gender) {
      if (!this.isValidGender(gender)) return "Giới tính không hợp lệ";
    }

    if (!isUpdating || address) {
      if (!this.isValidAddress(address)) return "Địa chỉ không hợp lệ";
    }

    if (!isUpdating || cardCode) {
      if (!this.isValidCardCode(cardCode)) return "Số thẻ đoàn không hợp lệ";
    }

    if (!isUpdating || joinedDate) {
      if (!this.isValidJoinedDate(joinedDate))
        return "Ngày vào đoàn không hợp lệ";
    }

    if (!isUpdating || chapterCode) {
      const chapter = await chapterService.getChapterWithKey({ chapterCode });
      if (!chapter) return "Chi đoàn sinh hoạt không hợp lệ";
    }

    if (!isUpdating || password) {
      if (!this.isValidPassword(password)) return "Mật khẩu không hợp lệ";
    }

    return true;
  };

  createNewAdmin = async (input) => {
    const valid = await this.isValidAdmin(input);
    if (valid !== true) return valid; // nếu không hợp lệ, trả về thông báo lỗi

    const { username, email, phone, password } = input;

    const admin = new User({
      username,
      email,
      phone,
      password: await bcryptHelper.hashPassword(password),
      role: "admin",
      status: "active",
    });

    const result = await admin.save();
    return result;
  };

  createNewManager = async (input) => {
    const valid = await this.isValidManager(input);
    if (valid !== true) return valid;

    const { username, password } = input;

    const manager = new User({
      username,
      password: await bcryptHelper.hashPassword(password),
      role: "manager",
      status: "active",
    });

    const result = await manager.save();
    return result;
  };

  createNewMember = async (input) => {
    const valid = await this.isValidMember(input);
    if (valid !== true) return valid;

    const {
      username,
      email,
      phone,
      password,
      fullname,
      birthdate,
      gender,
      address,
      cardCode,
      joinedDate,
      chapterCode,
    } = input;

    const member = new User({
      username,
      email,
      phone,
      password: await bcryptHelper.hashPassword(password),
      fullname,
      birthdate,
      gender,
      address,
      cardCode,
      joinedDate,
      chapterCode,
      position: "doan_vien",
      role: "member",
    });

    const result = await member.save();
    return result;
  };

  updateAdmin = async (id, input) => {
    // Kiểm tra hợp lệ
    const valid = await this.isValidAdmin(input, true);
    if (valid !== true) return valid;

    const admin = await this.getUserWithKey({ _id: id });
    if (!admin) return "Admin không tồn tại";

    const { username, email, phone } = input;

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;

    const result = await admin.save();
    return result;
  };

  updateManager = async (id, input) => {
    const valid = await this.isValidManager(input, true);
    if (valid !== true) return valid;

    const manager = await this.getUserWithKey({ _id: id });
    if (!manager) return "Người dùng không tồn tại";

    const { email, phone } = input;

    if (email) manager.email = email;
    if (phone) manager.phone = phone;

    const result = await manager.save();
    return result;
  };

  updateMember = async (id, input) => {
    const valid = await this.isValidMember(input, true);
    if (valid !== true) return valid;

    const member = await this.getUserWithKey({ _id: id });
    if (!member) return "Member không tồn tại";

    const {
      username,
      email,
      phone,
      fullname,
      birthdate,
      gender,
      address,
      cardCode,
      joinedDate,
    } = input;

    if (username) member.username = username;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (fullname) member.fullname = fullname;
    if (birthdate) member.birthdate = birthdate;
    if (gender) member.gender = gender;
    if (address) member.address = address;
    if (cardCode) member.cardCode = cardCode;
    if (joinedDate) member.joinedDate = joinedDate;

    const result = await member.save();
    return result;
  };

  activeUser = async (key) => {
    const user = await this.getUserWithKey(key);
    if (!user) return "Người dùng không tồn tại";

    user.status = "active";
    return await user.save();
  };

  lockUser = async (key) => {
    const user = await this.getUserWithKey(key);
    if (!user) return "Người dùng không tồn tại";

    user.status = "locked";
    return await user.save();
  };
}

export default new UserService();
