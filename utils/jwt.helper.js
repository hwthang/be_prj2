import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey"; // lưu trong .env
const JWT_EXPIRES = "7d"; // thời gian sống token

const jwtHelper = {
  // Tạo token
  signToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  },

  // Xác thực token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
};

export default jwtHelper;
