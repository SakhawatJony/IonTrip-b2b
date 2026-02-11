import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
const apiBaseUrl =
  process.env.VITE_API_BASE_URL ||
  'https://iontrip-backend-production.up.railway.app'

export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
  },
})
