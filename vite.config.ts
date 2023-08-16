import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
      '/user':'http://localhost:8080',
      '/student':'http://localhost:8080',
      '/class':'http://localhost:8080',
      '/course':'http://localhost:8080',
    }
  }
})
