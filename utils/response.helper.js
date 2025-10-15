export default class ResponseBuilder {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  // ✅ Thành công
  static success(message = "Thành công", data = null, statusCode = 200) {
    return new ResponseBuilder(true, message, data, statusCode);
  }

  // ❌ Thất bại
  static error(message = "Thất bại", data = null, statusCode = 200) {
    return new ResponseBuilder(false, message, data, statusCode);
  }

  // ⚙️ Gửi ra response nếu có Express
  send(res) {
    if (!res) return this; // Nếu không truyền res (dùng trong service)
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
    });
  }
}
