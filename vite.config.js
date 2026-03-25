import { defineConfig } from 'vite'

export default defineConfig({
  base: '/wng-landing/',
  root: '.',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096
  }
})
