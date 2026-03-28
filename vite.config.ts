import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/assets': resolve('src/assets'),
      '@/components': resolve('src/components'),
      '@/hooks': resolve('src/hooks'),
      '@/store': resolve('src/store'),
      '@/utils': resolve('src/utils')
    }
  }
})
