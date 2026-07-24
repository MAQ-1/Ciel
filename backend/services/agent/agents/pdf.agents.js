import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../util/generatePdf.js";
import { uploadToS3 } from "../util/uploadToS3.js";
import { getFromS3 } from "../util/getFromS3.js";


export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");
    const prompt = `
   You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}       
          

Rules:
- Generate 4-8 sections.
- Each section must contain 3-5 concise bullet points.
- Keep bullet points short (1-2 sentences maximum).
- Use clear professional language.


Topic:
 ${state.prompt}        
          `

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);

    const pdfbuffer = await generatePdf(data);
    const filename = `pdf-${Date.now()}.pdf`
    await uploadToS3(filename, pdfbuffer, "application/pdf")

    const downloadUrl = await getFromS3(filename, 24 * 60) // 10 minutes

    return {
      ...state,
      aiResponse: `
# 📄 PDF Generated Successfully

**${data.title}**

[⬇ Download PDF](${downloadUrl})

> Link expires in 24 hours.
`
    }
  } catch (err) {
    console.log(err);
    return {
      ...state,
      aiResponse: "failed to generate pdf, please try again later"
    }

  }

}