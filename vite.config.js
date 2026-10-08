import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://purvav0511.github.io/Porfolio/
export default defineConfig({
  plugins: [react()],
  base: '/Porfolio/',
})
