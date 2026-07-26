import { getModel } from "../config/llmModels.js";
import { getConversationContext } from "../util/getConversationContext.js";
import { deductCredits } from "../util/deductCredits.js";
export const codingAgent = async (state) => {

    try {

        const intentLlm = await getModel("intent");
        const llm = await getModel("coding");
        const conversationContext = await getConversationContext(
            state.conversationId
        );
const intentRes = await intentLlm.invoke(`
You are an intent classifier.

The user may refer to previous messages using words like:
- same
- previous
- above
- continue
- it
- that

Use the conversation history to understand the user's intent.

Conversation History:
${conversationContext}

Return ONLY one of these:

CODE_GENRATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

Current User Request:
${state.prompt}
`);

        const intent = intentRes.content
        console.log(intent)

        if (intent === "CODE_GENRATION") {
            const prompt = `
You are Ciel's Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

The preview environment supports ONLY:
- index.html
- style.css
- script.js

Rules for the project:
- Build a single-page website.
- Do NOT create or reference additional HTML files.
- Do NOT use href="/...", href="about.html", etc.
- Use section navigation only (e.g. href="#home", href="#about").
- Do NOT use local images like burger.jpg, ./images/, /assets/, etc.
- Use only valid public HTTPS image URLs (Unsplash, Pexels, Picsum, etc.).
- The website must work without any extra files.

Return ONLY valid JSON.

Rules:
- The response must be valid JSON.
- No markdown.
- No explanations.
- No comments outside the code.
- No extra punctuation.
- Never append "." after any line.
- Never alter HTML/CSS/JS syntax.
- Each file must contain only its own source code.
- HTML must not contain <link rel="stylesheet">.
- HTML must not contain <script src="...">.
- CSS belongs only in style.css.
- JavaScript belongs only in script.js.

Schema:

{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

Conversation History:
${conversationContext}

Current User Request:
${state.prompt}
        `

            const res = await llm.invoke(prompt)

            console.log("============== RAW MODEL OUTPUT ==============");
            console.log(res.content);
            console.log("==============================================");

            const cleaned = res.content
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            const data = JSON.parse(cleaned);
            await deductCredits(state.userId, "coding");
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
        await deductCredits(state.userId, "coding");
        return {
            ...state,
            aiResponse: data,
            artifacts: []
        }

    } catch (error) {
        return {
            ...state,
            aiResponse: "failed to generate response",

        }
    }

}