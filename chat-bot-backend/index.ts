import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload";
import chatRouter from "./routes/chat";

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/upload", uploadRouter);
app.use("/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
