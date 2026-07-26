import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../util/uploadToS3.js";
import { getFromS3 } from "../util/getFromS3.js";
import { deductCredits } from "../util/deductCredits.js"
import { checkAgentLimit } from "../config/agentlimit.js";
export const visionAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "vision")
        const llm = await getModel("vision");
        console.log(llm);
        const res = await llm.invoke(`
    
        const res=await llm.invoke
You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
    ${state.prompt}    
            
        
        `)


        const prompt = res.content.trim();

        //   image gen ke liye humne ek url banaya jisme hum prompt ko encode krke bhej rhe hai taki image generate ho sake
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

        await deductCredits(state.userId, "vision");


        const buffer = Buffer.from(imageRes.data)



        const filename = `${Date.now()}.png`

        await uploadToS3(filename, buffer, "image/png")



        const downloadUrl = await getFromS3(filename, 24 * 60) // 1 day



        return {
            ...state,
            aiResponse: `
Image Genrated Successfully! 

[⬇️ Download Image](${downloadUrl})

Link expires in 10 min...
`,
            images: [downloadUrl],
        };

    } catch (error) {
        if (error.status == 429) {
            return {
                ...state,
                aiResponse: error?.data?.message
            }
        }

        return {
            ...state,
            aiResponse: error.message,
        };
    }


}