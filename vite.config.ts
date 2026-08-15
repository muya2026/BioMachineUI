import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/BioMachineUI/', // IMPORTANT: Must match repo name
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
