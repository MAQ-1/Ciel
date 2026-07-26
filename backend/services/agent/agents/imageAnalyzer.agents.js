import { getModel } from "../config/llmModels.js";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import fs from "fs/promises";
import { deductCredits } from "../util/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";
export const imageAnalyzerAgent = async (state) => {


    try {
        await checkAgentLimit(state.userId, "vision")
        const llm = await getModel("imageAnalyzer");

        const imageBuffer = await fs.readFile(state.file.path);
        const base64Image = imageBuffer.toString("base64");

        const messages = [
            new SystemMessage(`
You are Ciel-AI Image Analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it exactly.
- If charts, graphs, or tables exist, explain them clearly.
- Describe objects, people, colors, scenes, and important details when asked.
- If the answer cannot be determined from the image, say so.
- Use Markdown when helpful.
- Do not hallucinate or make assumptions.
`),

            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: state.prompt || "Analyze the image."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${state.file.mimetype};base64,${base64Image}`
                        }
                    }
                ]
            })
        ];

        const response = await llm.invoke(messages);
        await deductCredits(state.userId, "vision");
        return {
            ...state,
            aiResponse: response.content,
        };
    } catch (error) {
        console.error("Image Analyzer Error:", error);

        if (error.status == 429) {
            return {
                ...state,
                aiResponse: error?.data?.message
            }
        }
        return {
            ...state,
            aiResponse: "Error analyzing the image. Please try again.",
        };
    } finally {
        if (state.file?.path) {
            try {
                await fs.unlink(state.file.path);
            } catch (err) {
                console.error("Failed to delete uploaded file:", err);
            }
        }
    }
};