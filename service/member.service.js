import Account from "../model/account.model.js";
import Member from "../model/member.model.js";
import bcryptHelper from "../utils/bcrypt.helper.js";

class MemberService {
  create = async (input) => {
    try {
      //TODO: thêm hàm kiểm tra đầu vào => trả về chuỗi là tên lỗi
      if (false) return "Lỗi cụ thể trả về";
      console.log(input);

      const newAccount = new Account({
        username: input?.username,
        email: input?.email,
        password: await bcryptHelper.hashPassword(input?.password),
      });

      const newProfile = new Member({
        fullname: input?.fullname ?? "Chưa có tên",
        phone: input?.phone ?? null,
        dateOfBirth: input?.dateOfBirth ?? null,
        gender: input?.gender ?? "male",

        hometown: {
          province: input?.hometown?.province ?? null,
          commune: input?.hometown?.commune ?? null,
          detail: input?.hometown?.detail ?? null,
        },

        address: {
          province: input?.address?.province ?? null,
          commune: input?.address?.commune ?? null,
          detail: input?.address?.detail ?? null,
        },

        ethnicity: input?.ethnicity ?? null,
        religion: input?.religion ?? null,
        education: input?.education ?? null,
        qualification: input?.qualification ?? null,
        political: input?.political ?? null,

        memberNumber: input?.memberNumber ?? null,
        joinedAt: input?.joinedAt ?? null,
        position: input?.position ?? "dv",
        chapter: input?.chapter ?? null,
      });

      await newProfile.save();
      newAccount.profile = newProfile.id;
      await newAccount.save();

      const newMember = await Account.findById(newAccount.id).populate(
        "profile"
      );
      return newMember;
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo mới đoàn viên";
    }
  };
 update = async (id, input) => {
  try {

    // Tìm account
    const account = await Account.findById(id).populate("profile");
    if (!account) return "Không tìm thấy tài khoản";

    // Cập nhật account (nếu có field liên quan)
    if (input?.username) account.username = input.username;
    if (input?.email) account.email = input.email;

    // Cập nhật profile (member)
    const profile = account.profile;
    if (!profile) return "Tài khoản chưa có hồ sơ";

    // Cập nhật từng field có trong input
    const updatableFields = [
      "fullname", "phone", "dateOfBirth", "gender",
      "ethnicity", "religion", "education", "qualification",
      "political", "memberNumber", "joinedAt", "position", "chapter"
    ];

    for (const field of updatableFields) {
      if (input?.[field] != undefined) {
        profile[field] = input[field];
      }
    }

    // Cập nhật nested object (address, hometown)
    if (input?.address) {
      profile.address = {
        ...profile.address,
        ...input.address,
      };
    }
    if (input?.hometown) {
      profile.hometown = {
        ...profile.hometown,
        ...input.hometown,
      };
    }

    // Lưu cả hai
    await profile.save();
    await account.save();

    // Lấy dữ liệu mới
    const updated = await Account.findById(id).populate("profile");
    return updated;
  } catch (err) {
    console.error(err);
    return "Lỗi khi cập nhật thông tin đoàn viên";
  }
};

}

export default new MemberService();
