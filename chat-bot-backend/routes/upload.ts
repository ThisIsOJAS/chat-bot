import express from "express";
import multer from "multer";
import { parseDocx, parsePdf } from "../utils/parser";
import { storeDocument } from "../embeddings/store";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    let text = "";
    if (file.mimetype === "application/pdf") {
      text = await parsePdf(file.buffer);
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await parseDocx(file.buffer);
    } else {
      return res.status(400).send("Unsupported file type");
    }

    const docId = await storeDocument(text);

    res.json({ docId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to parse or store document");
  }
});

export default router;
