import axios from "axios";
import graph from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import redis from '../../../shared/redis/redis.js';
// api key for agents

export const agent = async (req, res,next) => {
  try {

    //taking prompt from user
    const { prompt, conversationId, agent } = req.body;
    const file = req.file; // Access the uploaded file
    const userId=req.headers['x-user-id'];
    if (!prompt || !conversationId) {
      return res.status(400).json({ error: "Prompt and conversation ID are required" })
    }


    //  await redis.del(`messages-${conversationId}`); // Clear the cache for the conversation

    // calling the save-message api
    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
      conversationId,
      role: "user",
      content: prompt
    })
   

    // add the new message to redis cache
    await addMessage(conversationId, "user", prompt);

    
    //   starting the graph
    const result = await graph.invoke({
      prompt, conversationId, agent,userId,file

    })

    // console.log("GRAPH RESULT:");
    // console.dir(result, { depth: null });



    //   retutn ai response
    const response = result.aiResponse;

    
    // saving message from agent to redis cache
    await addMessage(conversationId, "assistant", response);


    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
      conversationId,
      role: "assistant",
      content: response,
      images: result?.images,
      artifacts: result?.artifacts
    })

    return res.status(200).json({
      answer: response,
      images: result?.images || [],
      artifacts: result?.artifacts || [],
    })


  } catch (error) {
    next(error);
     console.error(error);

  return res.status(500).json({
    console: error.message,
  });
  }
}

export const agentStream = async (req, res, next) => {
  let heartbeat = null
  try {
    const { prompt, conversationId, agent: agentName } = req.body;
    const userId = req.headers['x-user-id'];

    if (!prompt || !conversationId) {
      return res.status(400).json({ error: "Prompt and conversation ID are required" })
    }

    // CRITICAL: flush headers immediately as the very first action.
    // This sends bytes to ALB right away, resetting its 60s idle timer
    // before any async work (LLM, DB) begins.
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    // Safety-net heartbeat every 15s in case a layer between
    // the agent and ALB buffers the per-chunk SSE comments
    heartbeat = setInterval(() => {
      if (!res.writableEnded) res.write(": heartbeat\n\n")
    }, 15000)

    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
      conversationId, role: "user", content: prompt
    })
    await addMessage(conversationId, "user", prompt);

    const result = await graph.invoke({
      prompt, conversationId, agent: agentName || "coding", userId, streamRes: res
    })

    clearInterval(heartbeat)

    // Markdown path: codingAgent already wrote [DONE] and ended the response.
    // CODE_GENERATION path: codingAgent returned artifacts, we send them now.
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({
        text: result.aiResponse,
        artifacts: result.artifacts || [],
        images: result.images || []
      })}\n\n`)
      res.write(`data: [DONE]\n\n`)
      res.end()
    }

    await addMessage(conversationId, "assistant", result.aiResponse);
    await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
      conversationId,
      role: "assistant",
      content: result.aiResponse,
      images: result?.images,
      artifacts: result?.artifacts
    })

  } catch (error) {
    console.error(error);
    if (heartbeat) clearInterval(heartbeat)
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      res.write(`data: [DONE]\n\n`)
      res.end()
    }
  }
}