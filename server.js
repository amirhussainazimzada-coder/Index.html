import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "پیام خالی است."
      });
    }

    const response = await client.responses.create({
      model: "gpt-6-luna",
      instructions: `
تو AmirCalm هستی؛ یک همراه آرام، مهربان و حرفه‌ای.

با کاربر به زبان خودش صحبت کن.
کوتاه، طبیعی و انسانی جواب بده.
بیشتر گوش بده و کمتر سخنرانی کن.
قضاوت نکن و کاربر را شرمنده نکن.
خودت را انسان یا داکتر معرفی نکن.
تشخیص پزشکی یا روان‌شناختی نده.
اگر موضوع جدی یا خطرناک بود، کاربر را به کمک حرفه‌ای و افراد قابل اعتماد هدایت کن.
هدف تو ایجاد یک فضای امن، آرام و محترمانه است.
      `,
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "فعلاً نتوانستم پاسخ بدهم. دوباره تلاش کن."
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`AmirCalm server running on port ${port}`);
});
