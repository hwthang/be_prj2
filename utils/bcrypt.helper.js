import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const bcryptHelper = {
  // Hash password
  hashPassword: async (plainPassword) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(plainPassword, salt);
  },

  // So sánh password nhập với password hash trong DB
  comparePassword: async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};

export default bcryptHelper;
