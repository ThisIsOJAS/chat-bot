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

    console.log(
      `[UPLOAD] File received: ${file.originalname} (${file.mimetype})`
    );

    let text = "";
    if (file.mimetype === "application/pdf") {
      console.log("[UPLOAD] Parsing PDF...");

      text = await parsePdf(file.buffer);
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("[UPLOAD] Parsing DOCX...");

      text = await parseDocx(file.buffer);
    } else {
      return res.status(400).send("Unsupported file type");
    }

    console.log(
      `[UPLOAD] Parsing complete. Characters extracted: ${text.length}`
    );

    const docId = await storeDocument(text);

    console.log(`[UPLOAD] Document processed and stored with ID: ${docId}`);

    res.json({ docId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to parse or store document");
  }
});

export default router;
