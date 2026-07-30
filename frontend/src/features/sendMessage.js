import api from '../utils/axios'

async function sendMessage(payload) {
    try {
        const { data } = await api.post("/api/agent/chat", payload)
        return data
    } catch (error) {
        console.error("Error sending message", error)
        return null  // explicit null so callers can guard instead of dispatching { content: undefined }
    }
}

export default sendMessage