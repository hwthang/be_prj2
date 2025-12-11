import { buildResponse } from "../../../utils/response.helper.js";
import likeService from "../service/like.service.js";

class LikeController {
  createLike = async (req,res) => {
    const data = {...req.body}
     const result = await likeService.createLike(data);
        if (typeof result == "string")
          return res.json(buildResponse(result, false));
    
        return res.json(
          buildResponse("Thích bài đăng thành công", true, {
            like: result,
          })
        );
  }

  deleteLike = async (req,res) => {
    const data = {...req.body}
     const result = await likeService.deleteLike(data);
        if (typeof result == "string")
          return res.json(buildResponse(result, false));
    
        return res.json(
          buildResponse("Hủy thích bài đăng thành công", true, {
            comment: result,
          })
        );
  }
}

export default new LikeController()