import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const parseDocx = async (buffer: Buffer): Promise<string> => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

export const parsePdf = async (buffer: Buffer): Promise<string> => {
  const result = await pdfParse(buffer);
  return result.text;
};
