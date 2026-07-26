import dotenv from "dotenv";
dotenv.config();

import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddings } from "./embedding.js";

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
});

export const vectorStore = async (docs, collectionName) => {
    return await QdrantVectorStore.fromDocuments(
        docs,
        embeddings,
        {
            client,
            collectionName,
        }
    );
};