import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode})=>({
  server: {
    host:true,
    proxy:{
      '/movies': 'https://cineai-a-movie-recommendation-platform.onrender.com',
      '/user': 'https://cineai-a-movie-recommendation-platform.onrender.com',
    }
  },
  base: mode === 'production' ? '/CineAI-A-Movie-Recommendation-Platform/' : '/',
  plugins: [react(), tailwindcss()],
}))
