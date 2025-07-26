import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { MemoryVectorStore } from "@langchain/community/vectorstores/memory/vectorstore";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

type StoredDoc = {
  id: string;
  vectorStore: MemoryVectorStore;
};

const documents = new Map<string, StoredDoc>();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// const embeddings = new OpenAIEmbeddings({
//   modelName: "text-embedding-ada-002",
//   openAIApiKey: process.env.OPENROUTER_API_KEY,
//   configuration: {
//     baseURL: "https://openrouter.ai/api/v1",
//   },
// });

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2", // small and effective
});

export async function storeDocument(text: string): Promise<string> {
  const id = uuidv4();

  console.log(`[STORE] New document ID generated: ${id}`);
  console.log("[STORE] Starting text splitting...");

  const splitDocs = await splitter.createDocuments([text]); // split document into overlapping chunks

  console.log(
    `[STORE] Text splitting complete. Total chunks: ${splitDocs.length}`
  );
  console.log("[STORE] Starting embedding...");

  // embed chunks and store in in-memory vector DB
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  console.log("[STORE] Embedding complete.");

  documents.set(id, { id, vectorStore });

  console.log(
    `[STORE] Document stored in memory. Current store size: ${documents.size}`
  );

  return id;
}

export async function queryDocument(
  id: string,
  userQuery: string
): Promise<string> {
  const doc = documents.get(id);
  if (!doc) return "No document found for this ID.";

  // const results = await doc.vectorStore.similaritySearch(userQuery, 4); // retrieve top matching chunks using vector similarity

  const results = await (doc.vectorStore as any).similaritySearch(userQuery, 4);

  const context = results
    .map((r: { pageContent: string }) => r.pageContent)
    .join("\n\n"); // combine results to form context

  return `Context:\n${context}\n\nQuestion:\n${userQuery}`;
}
