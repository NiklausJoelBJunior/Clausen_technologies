import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { resolve } from 'path'
import { writeFileSync, copyFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.js',
        onstart(options) {
          // Create package.json in dist-electron to mark as CommonJS
          writeFileSync(
            resolve(__dirname, 'dist-electron/package.json'),
            JSON.stringify({ type: 'commonjs' })
          )
          
          // Copy database.js to dist-electron
          try {
            mkdirSync(resolve(__dirname, 'dist-electron'), { recursive: true })
            copyFileSync(
              resolve(__dirname, 'electron/database.js'),
              resolve(__dirname, 'dist-electron/database.js')
            )
            copyFileSync(
              resolve(__dirname, 'electron/fingerprint.js'),
              resolve(__dirname, 'dist-electron/fingerprint.js')
            )
          } catch (error) {
            console.error('Error copying files:', error)
          }
          
          options.startup()
        },
      },
      {
        entry: 'electron/preload.js',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist-vite',
    emptyOutDir: true,
  },
})
