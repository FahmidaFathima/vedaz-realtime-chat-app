import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// The backend runs on its own port. The Vite dev server proxies REST and
// WebSocket traffic to it, so the browser only ever talks to the Vite origin.
// This keeps everything working inside sandboxed / proxied preview environments.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/messages": { target: BACKEND_URL, changeOrigin: true },
      "/health": { target: BACKEND_URL, changeOrigin: true },
      "/socket.io": { target: BACKEND_URL, changeOrigin: true, ws: true },
    },
  },
})
