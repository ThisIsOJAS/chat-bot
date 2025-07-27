import express from "express";
import { chatWithDocument } from "../services/chatService";
import { storeDocument } from "../embeddings/store";

const router = express.Router();

router.post("/", async (req, res) => {
  let { docId, question } = req.body;

  if (!question) {
    return res.status(400).send("Missing question");
  }

  try {
    // fallback if no docId // document
    if (!docId) {
      docId = await storeDocument(question);
    }
    const response = await chatWithDocument(docId, question);
    res.json({ response });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).send("Chat processing failed");
  }
});

export default router;
