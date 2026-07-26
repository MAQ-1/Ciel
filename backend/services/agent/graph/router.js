import { getModel } from "../config/llmModels.js";
import { getConversationContext } from "../util/getConversationContext.js";

export const router = async (state) => {

  if (state.agent && state.agent !== "auto") {

    return {
      ...state,
      agent: state.agent
    }
  }

if (state.file?.mimetype === "application/pdf") {
  return {
    ...state,
    agent: "pdfRag",
  };
}

if (state.file?.mimetype?.startsWith("image/")) {
  return {
    ...state,
    agent: "imageAnalyzer",
  };
}

const conversationContext = await getConversationContext(
  state.conversationId
);




  const llm = await getModel("router")

const prompt = `
You are Ciel's AI Router.

Your ONLY job is to select the SINGLE best agent.

Do NOT answer the request.
Do NOT explain your reasoning.
Return ONLY the agent name.

Always choose based on the USER'S INTENT, not keywords.

The user may refer to previous conversation using words like:
- same
- previous
- above
- below
- this
- that
- it
- continue
- update
- modify
- convert

Use the conversation history to resolve these references.

==================================================
AVAILABLE AGENTS
==================================================

CHAT

Use CHAT for:
- General conversation
- Explanations
- Questions
- Writing
- Brainstorming
- Translation
- Summarization
- Advice
- Mathematics
- Follow-up questions
- Questions about previously generated content

Examples:

- What did I ask earlier?
- Explain the previous answer.
- What topic was the presentation about?
- Explain slide 2.
- Summarize the PDF.
- Tell me more.
- Continue explaining.
- Why?
- How does it work?

==================================================

SEARCH

Use SEARCH ONLY when current or live information is required.

Examples:

- Latest AI news
- Weather today
- Bitcoin price
- IPL score
- Search the web
- Current events
- Today's headlines

==================================================

CODING

Use CODING for software development.

Examples:

- Write code
- Debug code
- Explain code
- Fix bugs
- Optimize code
- Build React app
- MERN
- Docker
- AWS
- MongoDB
- Node.js
- Express
- LangChain
- LangGraph
- DSA
- LeetCode

Follow-up examples:

- Continue the previous code
- Add authentication
- Make it responsive
- Optimize it

==================================================

PDF

Use PDF ONLY when the user wants to CREATE, GENERATE, EXPORT, SAVE or CONVERT something into a PDF.

Examples:

- Create a PDF
- Generate a PDF
- Export as PDF
- Save as PDF
- Convert to PDF
- Convert the presentation into a PDF
- Turn these notes into a PDF
- Generate study notes as PDF

DO NOT choose PDF when the user is only asking questions about a PDF.

==================================================

PPT

Use PPT ONLY when the user wants to CREATE or MODIFY a presentation.

Examples:

- Create a presentation
- Generate a PPT
- Make slides
- Add another slide
- Update slide 3
- Remove slide
- Improve presentation
- Continue the presentation

DO NOT choose PPT when the user is:

- Asking about the presentation
- Explaining the presentation
- Converting it into another format

Examples:

- What topic was the presentation about?
- Explain slide 2.
- Convert the presentation into a PDF.

==================================================

VISION

Use VISION for image generation, editing and analysis.

Examples:

- Create an image
- Generate an image
- Draw a lion
- Design a logo
- Create artwork
- Create poster
- Create banner
- Create thumbnail
- Remove background
- Make it realistic
- Analyze this image

==================================================

ROUTING RULES

1. Current or live information
→ search

2. Programming or software development
→ coding

3. Create / Generate / Export / Save / Convert to PDF
→ pdf

4. Create / Generate / Edit / Modify presentation
→ ppt

5. Create / Generate / Edit / Analyze image
→ vision

6. Questions about previous responses or generated content
→ chat

7. Everything else
→ chat

==================================================

Conversation History:

${conversationContext}

==================================================

Current User Request:

${state.prompt}

==================================================

Return EXACTLY one word.

chat
search
coding
pdf
ppt
vision
`;

  const response = await llm.invoke(prompt);
  const agent = response.content.trim().toLowerCase();
  console.log("ROUTER SELECTED:", agent);
  return {
    ...state,
    agent: response.content.trim().toLowerCase()
  }

}