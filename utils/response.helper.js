export default class ResponseBuilder {
  constructor(success, message, data = null, errorCode = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  // ✅ Thành công
  static success(message = "Thành công", data = null, statusCode = 200) {
    return new ResponseBuilder(true, message, data, null, statusCode);
  }

  // ❌ Thất bại
  static error(message = "Thất bại", errorCode = "ERROR", statusCode = 200, data = null) {
    return new ResponseBuilder(false, message, data, errorCode, statusCode);
  }

  // ⚙️ Gửi ra response nếu có Express
  send(res) {
    if (!res) return this; // Nếu không truyền res (dùng trong service)
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
    });
  }
}
