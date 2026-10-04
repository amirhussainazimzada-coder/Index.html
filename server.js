import express from "express";

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

app.get("/api/chat", (req, res) => {
  res.json({
    connected: true,
    message: "AmirCalm chat connection is working."
  });
});

app.post("/api/chat", (req, res) => {
  console.log("CHAT POST RECEIVED");
  console.log(req.body);

  res.json({
    reply: "اتصال AmirCalm برقرار است. 🤍"
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`AmirCalm server running on port ${port}`);
});
