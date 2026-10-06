import express from "express";

import OpenAI from "openai";

import path from "path";

import { fileURLToPath } from "url";

const app = express();

const port = process.env.PORT || 3000;

// برای پیدا کردن مسیر فایل‌های سایت

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// OpenAI

const apiKey = process.env.OPENAI_API_KEY

  ?.replace(/[\u200B-\u200D\u200E\u200F\uFEFF]/g, "")

  .trim();

const client = new OpenAI({

  apiKey

});

// CORS

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  res.header(

    "Access-Control-Allow-Headers",

    "Origin, X-Requested-With, Content-Type, Accept"

  );

  if (req.method === "OPTIONS") {

    return res.sendStatus(204);

  }

  next();

});

app.use(express.json());

// ================================

// AmirCalm Website

// ================================

// فایل‌های سایت را نمایش بده

app.use(express.static(__dirname));

// صفحه اصلی سایت

app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname, "index.html"));

});

// ================================

// Health Check

// ================================

app.get("/health", (req, res) => {

  res.json({

    status: "ok"

  });

});

// ================================

// AI Chat

// ================================

app.post("/api/chat", async (req, res) => {

  try {

    const message = req.body?.message;

    if (!message || typeof message !== "string") {

      return res.status(400).json({

        error: "پیام خالی است."

      });

    }

    const response = await client.responses.create({

      model: "gpt-5-mini",

      instructions: `

تو AmirCalm هستی؛ یک همراه آرام، مهربان و حرفه‌ای.

با کاربر به زبان خودش صحبت کن.

کوتاه، طبیعی و انسانی جواب بده.

بیشتر گوش بده و کمتر سخنرانی کن.

قضاوت نکن.

کاربر را شرمنده نکن.

خودت را انسان یا داکتر معرفی نکن.

تشخیص پزشکی یا روان‌شناختی نده.

اگر کاربر ناراحت، ترسیده یا مضطرب است،

اول با آرامش احساس او را درک کن و بعد پاسخ بده.

اگر موضوع جدی یا خطرناک بود،

کاربر را به کمک حرفه‌ای و افراد قابل اعتماد هدایت کن.

هدف AmirCalm ایجاد یک فضای امن،

آرام و محترمانه برای گفت‌وگو است.

      `,

      input: message

    });

    res.json({

      reply: response.output_text

    });

  } catch (error) {

    console.error("AmirCalm API Error:", error);

    res.status(500).json({

      error: "در حال حاضر امکان پاسخ‌گویی وجود ندارد."

    });

  }

});

// ================================

// Start Server

// ================================

app.listen(port, "0.0.0.0", () => {

  console.log(`AmirCalm server running on port ${port}`);

});
