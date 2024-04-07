import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["mupen64plus-web"]
  },

  build: {
    commonjsOptions: {
      include: [/mupen64plus-web/, /node_modules/]
    }
  },

})
