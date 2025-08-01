import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Only define the API key, not the entire import.meta.env object
    __GEMINI_API_KEY__: JSON.stringify(process.env.VITE_GEMINI_API_KEY || ''),
    __IS_DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    global: 'globalThis'
  }
})
