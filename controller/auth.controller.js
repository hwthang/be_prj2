import accountService from "../service/user.service.js";
import authService from "../service/auth.service.js";
import chapterService from "../service/chapter.service.js";
import ResponseBuilder from "../utils/response.helper.js";

class AuthController {
  login = async (req, res) => {
    try {
      const input = req.body;

      const result = await authService.login(input);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Đăng nhập thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi đăng nhập", null, 500).send(res);
    }
  };

  register = async (req, res) => {
    try {
      const input = req.body;
      input.account.status = "pending";
      input.account.role = "member";
      input.profile.position = "dv";

      const result = await accountService.createUser(input);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Đăng ký thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi đăng ký tài khoản", null, 500).send(res);
    }
  };
}

export default new AuthController();
