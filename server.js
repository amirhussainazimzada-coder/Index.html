import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.json({
    service: "AmirCalm AI",
    status: "online"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.post("/api/chat", async (req, res) => {
  console.log("CHAT POST RECEIVED");

  try {
    const userMessage = req.body?.message;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({
        error: "پیام نامعتبر است."
      });
    }

    const rawKey = process.env.OPENAI_API_KEY || "";

    const apiKey = rawKey
      .replace(/[\u200B-\u200D\u200E\u200F\uFEFF]/g, "")
      .trim();

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing");

      return res.status(500).json({
        error: "کلید OpenAI تنظیم نشده است."
      });
    }

    console.log("SENDING TO OPENAI");

    const client = new OpenAI({
      apiKey: apiKey
    });

    const response = await client.responses.create({
      model: "gpt-6-luna",

      instructions: `
تو همراه هوشمند AmirCalm هستی.

وظیفه‌ات کمک به آرامش، سلامت روانی عمومی، رشد شخصی و حل مشکلات روزمره کاربر است.

با مهربانی، آرامش و بدون قضاوت صحبت کن.

اول حرف کاربر را خوب درک کن و اگر لازم بود یک سؤال کوتاه و هوشمندانه بپرس.

بعد راهکارهای مشخص، عملی و قابل اجرا پیشنهاد بده.

موضوعات مناسب:

اضطراب و استرس، احساسات، روابط، اعتمادبه‌نفس،
انگیزه، درس، کار، عادت‌ها، تصمیم‌گیری و مشکلات روزمره.

جواب‌ها را طبیعی، انسانی، گرم و نسبتاً کوتاه نگه دار.

از جملات کلیشه‌ای و نصیحت‌های توخالی دوری کن.

خودت را پزشک یا روان‌درمانگر واقعی معرفی نکن و تشخیص پزشکی نده.

اگر موضوعی خارج از حوزه AmirCalm مثل سیاست، جنگ، اخبار یا بحث‌های جنجالی مطرح شد،
محترمانه گفتگو را دوباره به آرامش و زندگی کاربر برگردان.

اگر کاربر در خطر فوری یا قصد آسیب به خود یا دیگری را مطرح کرد،
با آرامش توصیه کن فوراً با یک فرد قابل اعتماد و خدمات اضطراری محلی تماس بگیرد.

هدف اصلی تو:

کمک واقعی، آرامش، وضوح ذهن و یک قدم عملی برای بهتر شدن.
`,

      input: userMessage
    });

    const reply = response.output_text;

    console.log("OPENAI RESPONSE RECEIVED");

    return res.json({
      reply: reply || "فعلاً نتوانستم پاسخ مناسبی آماده کنم. 🤍"
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return res.status(500).json({
      error: "ارتباط با هوش مصنوعی برقرار نشد."
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log("AmirCalm server running on port " + port);
});
