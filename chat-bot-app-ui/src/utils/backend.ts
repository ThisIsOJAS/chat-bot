import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const promptBooster =
  "You are an expert response maker. Provide answer in a predefined structure (e.g., summary + key points or action items).";

export const uploadDocument = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.docId;
};

export const askQuestion = async (
  docId: string,
  question: string
): Promise<string> => {
  const prompt = question + promptBooster;

  const response = await axios.post(`${BACKEND_URL}/chat`, {
    docId,
    question: prompt,
  });

  return response.data.response;
};
