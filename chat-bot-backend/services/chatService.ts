import { queryDocument } from "../embeddings/store";
import { OpenAI } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function chatWithDocument(
  id: string,
  question: string
): Promise<string> {
  try {
    const formattedPrompt = await queryDocument(id, question);

    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Use the provided context to answer the user's question accurately.",
        },
        {
          role: "user",
          content: formattedPrompt,
        },
      ],
    });

    return response.choices[0].message.content || "No response.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Something went wrong during chat.";
  }
}
