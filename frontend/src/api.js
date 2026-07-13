import axios from "axios"

// In development the Vite dev server proxies these paths to the backend.
// In production set VITE_API_URL to the deployed backend origin.
const baseURL = import.meta.env.VITE_API_URL || ""

const api = axios.create({ baseURL })

/**
 * Fetch all chat messages, sorted by timestamp (oldest first).
 */
export async function fetchMessages() {
  const { data } = await api.get("/messages")
  return data
}

/**
 * Persist a new message through the REST API.
 * The backend also broadcasts it over Socket.io.
 */
export async function sendMessage({ username, content, clientId }) {
  const { data } = await api.post("/messages", { username, content, clientId })
  return data
}

export default api
