import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode})=>({
  server: {
    host:true,
    proxy:{
      '/movies': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
    }
  },
  base: mode === 'production' ? '/CineAI-A-Movie-Recommendation-Platform/' : '/',
  plugins: [react(), tailwindcss()],
}))
