import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadToS3 } from "../util/uploadToS3.js";
import { getFromS3 } from "../util/getFromS3.js";


export const visionAgent = async (state) => {
    try {

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
        // console.log("Step 1: Image URL created");

        //   image gen ke liye humne ek url banaya jisme hum prompt ko encode krke bhej rhe hai taki image generate ho sake
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
        // console.log(imageUrl);
        const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

        // console.log("Step 2: Image downloaded");


        const buffer = Buffer.from(imageRes.data)

        // console.log("Step 3: Buffer created");

        const filename = `${Date.now()}.png`

        await uploadToS3(filename, buffer, "image/png")
        // console.log("Step 4: Uploaded to S3");


        const downloadUrl = await getFromS3(filename, 24*60) // 1 day

        // console.log("Step 5: Signed URL generated");

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
        console.error(error.message);
        console.error(error.response?.status);
        console.error(error.response?.data);

        return {
            ...state,
            aiResponse: error.message,
        };
    }


}