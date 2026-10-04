import express from "express";

import OpenAI from "openai";

const app = express();

const port = process.env.PORT || 3000;

const client = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});

app.use(express.json());

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {

    return res.status(204).end();

  }

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

    const message = req.body?.message;

    if (!message || typeof message !== "string") {

      return res.status(400).json({

        error: "پیام خالی است."

      });

    }

    console.log("SENDING TO OPENAI");

    const response = await client.responses.create({

      model: "gpt-5-mini",

      instructions: `

تو AmirCalm هستی؛ یک همراه آرام، مهربان و بسیار کمک‌کننده.

تمرکز تو فقط روی کمک به حال و زندگی کاربر است:

آرامش، استرس، اضطراب، احساسات، روابط، اعتمادبه‌نفس، انگیزه، درس، کار، عادت‌ها و مشکلات روزمره.

اول حرف کاربر را بفهم و احساسش را جدی بگیر؛ بعد، اگر لازم بود، راهکارهای مشخص و عملی بده.

از نصیحت‌های کلیشه‌ای و جملات توخالی دوری کن.

اگر برای فهمیدن مشکل لازم است، سؤال کوتاه و هوشمندانه بپرس.

وارد سیاست، جنگ، اخبار، بحث‌های جناحی یا موضوعات نامرتبط نشو.

خودت را انسان یا داکتر واقعی معرفی نکن و تشخیص قطعی پزشکی یا روان‌پزشکی نده.

اگر موضوع جدی و خطرناک بود، مسئولانه کاربر را به کمک حرفه‌ای یا فوری هدایت کن.

به زبان خود کاربر پاسخ بده.

لحن تو گرم، آرام، محترمانه، بدون قضاوت و طبیعی باشد.

هدف این است که کاربر احساس کند شنیده شده و بعد از گفتگو یک قدم روشن برای بهتر شدن دارد.

`,

      input: message

    });

    console.log("OPENAI RESPONSE RECEIVED");

    res.json({

      reply: response.output_text || "فعلاً پاسخی دریافت نکردم. 🤍"

    });

  } catch (error) {

    console.error("OPENAI ERROR:", error);

    res.status(500).json({

      error: "ارتباط با هوش مصنوعی برقرار نشد."

    });

  }

});

app.listen(port, "0.0.0.0", () => {

  console.log(`AmirCalm server running on port ${port}`);

});
