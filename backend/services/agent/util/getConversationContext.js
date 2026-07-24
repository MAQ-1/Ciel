import { getMemory } from "../config/memory.js";

export const getConversationContext = async (conversationId) => {
  const history = await getMemory(conversationId);

  if (!history || history.length === 0) {
    return "";
  }

  return history
    .slice(-6) // Last 6 messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n\n");
};