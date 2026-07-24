import axios from "axios";
import graph from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import redis from '../../../shared/redis/redis.js';
// api key for agents

export const agent = async (req, res) => {
  try {

    //taking prompt from user
    const { prompt, conversationId, agent } = req.body;
    console.log(req.body);
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

    //   starting the graph
    const result = await graph.invoke({
      prompt, conversationId, agent

    })

    console.log("GRAPH RESULT:");
    console.dir(result, { depth: null });



    //   retutn ai response
    const response = result.aiResponse;

    // add the new message to redis cache
    await addMessage(conversationId, "user", prompt);
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
     console.error(error);

  return res.status(500).json({
    console: error.message,
  });
  }
}