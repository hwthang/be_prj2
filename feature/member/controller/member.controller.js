import { buildResponse } from "../../../utils/response.helper.js";
import memberService from "../service/member.service.js";

class MemberController {
  createNewMember = async (req, res) => {
    try {
      const data = req.body;
      const result = await memberService.createNewMember(data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Tạo đoàn viên thành công", true, {
          newMember: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi tạo đoàn viên", false));
    }
  };

  getAllMembers = async (req, res) => {
    try {
      const { chapterId } = req.query;
      const result = chapterId
        ? await memberService.getAllMembersOfChapter(chapterId)
        : await memberService.getAllMembers();

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách đoàn viên thành công", true, {
          members: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy danh sách đoàn viên", false));
    }
  };

  getMemberById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await memberService.getMemberById(id);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách đoàn viên thành công", true, {
          member: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy danh sách đoàn viên", false));
    }
  };

  updateMemberById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await memberService.updateMemberById(id, data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Cập nhật đoàn viên thành công", true, {
          newMember: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi cập nhật đoàn viên", false));
    }
  };
}

export default new MemberController();
