import userService from "../service/user.service.js";
import jwtHelper from "../utils/jwt.helper.js";

export const verifyToken = async (req, res, next) => {
  // Lấy header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Thiếu token trong header" });
  }

  // Header dạng "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  // Verify token
  const decoded = jwtHelper.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }

  // Gắn thông tin user vào req
  const user = await userService.getUserWithKey({_id: decoded.id})
  req.user = user
  next();
};
