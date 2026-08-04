import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Mirror of the `paths` entry in tsconfig.app.json. TypeScript's copy only
    // type-checks; this one is what actually resolves the import at build time.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
