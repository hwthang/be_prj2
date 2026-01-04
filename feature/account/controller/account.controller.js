import { buildResponse } from "../../../utils/response.helper.js";
import Account from "../model/account.model.js";
import accountService from "../service/account.service.js";

class AccountController {
  createAdmin = async (req, res) => {
    try {
      const data = req.body;
      const result = await accountService.createAdmin(data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Tạo tài khoản quản trị viên thành công", true, {
          newAdmin: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(
        buildResponse("Lỗi khi tạo tài khoản quản trị viên", false)
      );
    }
  };

  login = async (req, res) => {
    try {
      const data = req.body;
      const result = await accountService.login(data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Đăng nhập thành công", true, {
          token: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi đăng nhập", false));
    }
  };

  activate = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await accountService.activate(id);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Kích hoạt tài khoản thành công", true, {
          account: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi kích hoạt tài khoản", false));
    }
  };

  inactivate = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await accountService.inactivate(id);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Hủy kích hoạt tài khoản thành công", true, {
          account: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi hủy kích hoạt tài khoản", false));
    }
  };

  recoverPassword = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const result = await accountService.recoverPassword(id, data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Khôi phục mật khẩu thành công", true, {
          account: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi khôi phục mật khẩu", false));
    }
  };

  changeAvatar = async (req, res) => {
    try {
      const { id } = req.params;
      const { avatar } = req?.body || {};

      const result = await accountService.changeAvatar(id, avatar);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Thay đổi avatar thành công", true, {
          account: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi thay đổi avatar", false));
    }
  };

  getAccountById = async (req, res) => {
    const { accountId } = req.params;
    const data = await Account.findById(accountId)
      .select("avatar displayName")
      .lean();
    res.json(data);
  };
}

export default new AccountController();
