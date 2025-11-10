import userService from "../service/user.service.js";
import ResponseBuilder from "../utils/response.helper.js";

class UserController {
  // 🧩 Tạo tài khoản
  createUser = async (req, res) => {
    try {
      const input = req.body;
      const result = await userService.createUser(input);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Tạo tài khoản thành công", result).send(
        res
      );
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi tạo tài khoản", null, 500).send(res);
    }
  };

  // 🧩 Lấy danh sách tài khoản
  getUsers = async (req, res) => {
    try {
      const result = await userService.getUsers();

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success(
        "Lấy danh sách tài khoản thành công",
        result
      ).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi lấy danh sách tài khoản", null, 500).send(
        res
      );
    }
  };

  // 🧩 Lấy thông tin tài khoản
  getUser = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userService.getUser(id);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success(
        "Lấy thông tin tài khoản thành công",
        result
      ).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi lấy thông tin tài khoản", null, 500).send(
        res
      );
    }
  };

  // 🧩 Cập nhật tài khoản
  updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const input = req.body;
      const result = await userService.updateUser(id, input);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success(
        "Cập nhật tài khoản thành công",
        result
      ).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi cập nhật tài khoản", null, 500).send(res);
    }
  };

  // 🧩 Kích hoạt tài khoản
  activeUser = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userService.updateUser(id, {
        account: { status: "active" },
      });

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success(
        "Kích hoạt tài khoản thành công",
        result
      ).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi kích hoạt tài khoản", null, 500).send(res);
    }
  };

  // 🧩 Khóa tài khoản
  lockUser = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userService.updateUser(id, {
        account: { status: "locked" },
      });

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Khóa tài khoản thành công", result).send(
        res
      );
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi khóa tài khoản", null, 500).send(res);
    }
  };

  updateAvatar = async (req, res) => {
    try {
      const id = req.params.id;
      const avatar = req.file;
      console.log(req.file);
      console.log(avatar);
      const result = await userService.updateUser(id, {
        profile: { avatar: avatar },
      });

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success(
        "Cập nhật ảnh đại diện thành công",
        result
      ).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi cập nhật ảnh đại diện", null, 500).send(
        res
      );
    }
  };
}

export default new UserController();
