import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Moderate content for Youth Union platform
 * @param {Object} input - Nội dung đầu vào
 * @param {string} [input.text] - Chuỗi văn bản cần kiểm duyệt
 * @param {string} [input.imageUrl] - URL ảnh Cloudinary cần kiểm duyệt
 * @returns {Promise<{message:string, success:boolean}>}
 */
export async function moderateContent(input) {
  if (!input || (!input.text && !input.imageUrl)) {
    throw new Error("Input must contain either 'text' or 'imageUrl'");
  }

  const payload = JSON.stringify(input);

  const prompt = `
Bạn là hệ thống kiểm duyệt nội dung của nền tảng truyền thông Đoàn Thanh niên.
Hãy đánh giá nội dung (văn bản hoặc hình ảnh) xem có vi phạm tiêu chí chính trị, đạo đức, văn hóa hay không.

Tiêu chí cần kiểm duyệt:
- Chống phá, xuyên tạc lịch sử
- Kích động bạo lực, thù hằn, phân biệt vùng miền / giới / tôn giáo
- Nội dung nhạy cảm, tục tĩu, phản cảm
- Rượu bia, chất kích thích, tệ nạn xã hội
- Thông tin sai sự thật, bôi nhọ tổ chức/cá nhân
- Trái thuần phong mỹ tục hoặc giá trị của Đoàn Thanh niên

Luật trả lời (chỉ trả về JSON tiếng Việt, KHÔNG được ghi thêm chữ):
Nếu hợp lệ -> {"message":"Nội dung được chấp thuận","success":true}
Nếu vi phạm -> {"message":"Từ chối: [mô tả vi phạm]","success":false}

Hãy đánh giá nội dung sau và trả về CHỈ JSON:
${payload}
`.trim();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 }, // tắt phần reasoning
    },
  });

  const rawText = response.text; // <-- .text() đúng cú pháp
  console.log("Raw moderation response:", rawText);

  // ==========================================
  // CHUYỂN TEXT GEMINI → JSON AN TOÀN
  // ==========================================
  try {
    // Trường hợp Gemini trả dư ký tự: markdown, ```json, xuống dòng...
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON PARSE ERROR:", err);
    throw new Error("Invalid JSON from moderation model: " + rawText);
  }
}
