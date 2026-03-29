import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/budget-familial/', // Change this to your GitHub repo name
  build: {
    outDir: 'dist',
  },
})
