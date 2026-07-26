import fs from "fs/promises";
import { PDFParse } from 'pdf-parse'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { vectorStore } from "../config/vectorDB.js";
import { getModel } from "../config/llmModels.js";
import { deductCredits } from "../util/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";
export const pdfRagAgent = async (state) => {

    await checkAgentLimit(state.userId, "pdf")
    try {
        // Read uploaded PDF
        const buffer = await fs.readFile(state.file.path);

        // Extract text
        const parser = new PDFParse({
            data: buffer,
        });
        const result = await parser.getText();

        const text = result.text;

        if (!text || text.trim().length === 0) {
            return {
                ...state,
                aiResponse: "The uploaded PDF does not contain readable text."
            };
        }

        // Split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await splitter.createDocuments([text]);

        // Create vector collection
        const collectionName = `pdf-${Date.now()}`;

        // Store embeddings
        const store = await vectorStore(docs, collectionName);

        // Retrieve relevant chunks
        const relevantDocs = await store.similaritySearch(state.prompt, 5);

        const context = relevantDocs
            .map((doc) => doc.pageContent)
            .join("\n\n");

        // Load LLM
        const llm = await getModel("pdfRag");

        const messages = [
            new SystemMessage(`
You are Ciel-AI PDF Assistant.

Rules:
- Answer ONLY from the uploaded PDF.
- Never make up information.
- If the answer is not present in the PDF, reply:
"I couldn't find this information in the uploaded PDF."
- Keep answers concise and accurate.
- Use Markdown formatting when appropriate.
            `),

            new HumanMessage(`
Context:
${context}

Question:
${state.prompt}
            `),
        ];

        // Generate response
        const response = await llm.invoke(messages);
        await deductCredits(state.userId, "pdf");

        return {
            ...state,
            aiResponse: response.content,
        };
    } catch (error) {
        console.error("PDF RAG Error:", error);

        if (error.status == 429) {
            return {
                ...state,
                aiResponse: error?.data?.message
            }
        }
        return {
            ...state,
            aiResponse: "Failed to process the PDF. Please try again.",
        };
    } finally {
        if (state.file?.path) {
            try {
                await fs.unlink(state.file.path);
            } catch (err) {
                console.error("Failed to delete file:", err);
            }
        }
    }
};