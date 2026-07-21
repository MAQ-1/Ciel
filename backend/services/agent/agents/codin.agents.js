import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
    const intentLlm = await getModel("intent");
    const llm = await getModel("coding");
    const intentRes = await intentLlm.invoke(`
     You are an intent classifier.

Return ONLY one of these Classifier.

CODE_GENRATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
    `)

    const intent = intentRes.content
    console.log(intent)

    if (intent === "CODE_GENRATION") {
        const prompt = `
       You are Ciel's Coding  Agent.

Generate the reuested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

-Responsive
-Modern UI
-CSS Varibale
-Flexbox / Grid
-Smooth Scroll
-Hover Effects
-Beautiful spacing
-Single page unless user asks otherwise.

Return ONLY valid JSON.

IMPORTANT:
- The response must be parseable by JSON.parse().
- Escape all newlines inside the "content" field using \n.
- Escape all double quotes inside code using \".
- Do NOT use markdown.
- Do NOT use \`\`\`json.
- Do NOT add any explanation before or after the JSON.
- Every "content" value must be a single JSON string.

Do NOT wrap the JSON in \`\`\`json or \`\`\`.

Return the JSON object directly.


Schema:

{
  "files": [
    {
      "name": "string",
      "content": "string"
    }
  ]
}



User Request:
${state.prompt}
        `

        const res = await llm.invoke(prompt)

        // console.log(res.content);

        const cleaned = res.content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        const data = JSON.parse(cleaned);

        return {
            ...state,
            aiResponse: "Code generated successfully.",
            artifacts: [
                {
                    id: Date.now(),
                    type: "Project",
                    files: data.files || [],
                    title: state.prompt

                }
            ]
        }
    }


    // code generation nhi hoga to ye chalega
    const res = await llm.invoke(`
        The user's request is:
${intent}

Return Markdown only.

Never generate project files.

use heading like:

#Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:
${state.prompt}
        `
    )

    const data = res.content
    return {
        ...state,
        aiResponse: data,
        artifacts: []
    }
}