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
 

  const payload = JSON.stringify(input);
  console.log(payload);


  

 const prompt = `
Bạn là HỆ THỐNG KIỂM DUYỆT NỘI DUNG của nền tảng truyền thông ĐOÀN THANH NIÊN VIỆT NAM.

Nhiệm vụ của bạn là đánh giá nội dung đầu vào (văn bản hoặc mô tả hình ảnh, không bắt buộc phải đầy đủ cả hai) và xác định xem nội dung đó CÓ VI PHẠM hay KHÔNG VI PHẠM các tiêu chí chính trị, đạo đức, văn hóa và giá trị của Đoàn Thanh niên.

====================
TIÊU CHÍ KIỂM DUYỆT
====================
Nội dung bị xem là vi phạm nếu thuộc MỘT HOẶC NHIỀU nhóm sau:
- Chống phá, xuyên tạc lịch sử; phủ nhận vai trò lãnh đạo của Đảng
- Kích động bạo lực, thù hằn; phân biệt vùng miền, giới tính, tôn giáo
- Nội dung nhạy cảm, tục tĩu, phản cảm, khiêu dâm
- Rượu bia, chất kích thích, tệ nạn xã hội, hành vi trái pháp luật
- Thông tin sai sự thật, tin giả, vu khống, bôi nhọ tổ chức hoặc cá nhân
- Nội dung trái thuần phong mỹ tục hoặc đi ngược giá trị, lý tưởng của Đoàn Thanh niên

====================
LUẬT TRẢ LỜI (BẮT BUỘC)
====================
- CHỈ được trả về JSON
- Ngôn ngữ: tiếng Việt
- KHÔNG được giải thích thêm
- KHÔNG được ghi chú ngoài JSON
- KHÔNG được suy đoán động cơ người đăng

KẾT QUẢ TRẢ VỀ:
- Nếu KHÔNG vi phạm:
{"message":"Nội dung được chấp thuận","success":true}

- Nếu CÓ vi phạm:
{"message":"Từ chối: [mô tả ngắn gọn, đúng bản chất vi phạm]","success":false}

====================
NỘI DUNG CẦN ĐÁNH GIÁ
====================
${payload}

Hãy phân tích nội dung trên và trả về CHỈ JSON theo đúng luật.
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
