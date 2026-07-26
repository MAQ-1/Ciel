import { getModel } from "../config/llmModels.js";
import { generatePpt } from "../util/generatePpt.js";
import { uploadToS3 } from "../util/uploadToS3.js";
import { getFromS3 } from "../util/getFromS3.js";
import { getConversationContext } from "../util/getConversationContext.js";
import { deductCredits } from "../util/deductCredits.js";
import { checkAgentLimit } from "../config/agentlimit.js";

export const pptAgent = async (state) => {

    
    try {
       await checkAgentLimit(state.userId, "ppt")
        const llm = await getModel("ppt");

        // help to remember the context of the conversation and provide better responses
        const conversationContext = await getConversationContext(
            state.conversationId
        );

        const prompt = `
         You are a professional presentation designer.
         
         
Return ONLY valid JSON.

Format:

{
    "title": "",
    "subtitle": "",
    "slides": [
        {
            "title": "",
            "points": [
                "",
                "",
                "",
                ""
            ]
        }
    ]
}

Rules:
- Generate 5-10 slides.
- Each slide must contain 6-9 concise bullet points.
- Keep bullet points short (1-2 sentences maximum).
- Use clear professional language.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Conversation History:
${conversationContext}

Current User Request:
${state.prompt}
`
        const res = await llm.invoke(prompt)
        const data = (JSON.parse(res.content));
        await deductCredits(state.userId, "ppt");
        const ppt = await generatePpt(data);
        const buffer = await ppt.write({
            outputType: "nodebuffer",
        });
        const filename = `ppt-${Date.now()}.pptx`
        await uploadToS3(filename, buffer, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
        const downloadUrl = await getFromS3(filename, 24 * 60) // 1 day


        return {
            ...state,
            aiResponse: `
# 📊 Presentation Generated Successfully

**${data.title}**

**Slides:** ${data.slides.length + 2}

[⬇ Download Presentation](${downloadUrl})

> This link will expire in 24 hours.
  `,
        };

    } catch (error) {
        console.log(error);

        if (error.status == 429) {
            return {
                ...state,
                aiResponse: error?.data?.message
            }
        }
        return {
            ...state,
            aiResponse: "failed to generate ppt"
        }
    }



}