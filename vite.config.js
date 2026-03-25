import { defineConfig } from 'vite'

export default defineConfig({
  base: '/LandingPages/',
  root: '.',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096
  }
})
