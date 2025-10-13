import chapterService from "../service/chapter.service.js";
import userService from "../service/user.service.js";
import ResponseBuilder from "../utils/response.helper.js";

class UserController {
  getUsers = async (req, res) => {
    try {

      const result = await


    } catch (error) {
      console.log(error);
      const errorRes = ResponseBuilder.error(error.message);
      errorRes.send(res);
      return;
    }
  };

  getUser = async (req, res) => {
    const id = req.params.id;
    // const user = req.user;

    // if (user.username != username && !["admin", "manager"].includes(user.role))
    //   res.send("Bạn không có quyền truy cập");

    const data = await userService.getUserWithKey({ _id: id });

    const result = data.toObject();
    result.chapter = null;
    if (result.chapterCode) {
      const chapter = await chapterService.getChapterWithKey({
        chapterCode: result.chapterCode,
      });

      result.chapter = { code: chapter.chapterCode, name: chapter.name };
    }

    delete result.chapterCode;
    console.log(result);

    res.send(result);
  };

  createNewUser = async (req, res) => {
    const { role, input } = req.body;
    console.log(req.body);
    switch (role) {
      case "admin": {
        const result = await userService.createNewAdmin(input);
        res.send(result);
      }
      case "manager": {
        const result = await userService.createNewManager(input);
        res.send(result);
      }
      case "member": {
        const result = await userService.createNewMember(input);
        res.send(result);
      }
    }
  };

  updateUserWithUsername = async (req, res) => {
    const updatingUser = await userService.getUserWithKey({
      _id: req.params.id,
    });

    const input = req.body;
    console.log(input);

    // if (
    //   req.user.username != updatingUser.username &&
    //   !["admin", "manager"].includes(req.user.role)
    // ) {
    //   res.send("Bạn không có quyền truy cập");
    // }

    const role = updatingUser.role;
    switch (role) {
      case "admin": {
        const result = await userService.updateAdmin(updatingUser.id, input);
        res.send(result);
        return;
      }
      case "manager": {
        const result = await userService.updateManager(updatingUser.id, input);
        res.send(result);
        return;
      }
      case "member": {
        const result = await userService.updateMember(updatingUser.id, input);
        res.send(result);
        return;
      }
    }
  };

  activeUser = async (req, res) => {
    const id = req.params.id;
    const result = await userService.activeUser({ _id: id });
    res.send(result);
    return;
  };

  lockUser = async (req, res) => {
    const id = req.params.id;
    const result = await userService.lockUser({ _id: id });
    res.send(result);
    return;
  };
}

export default new UserController();
