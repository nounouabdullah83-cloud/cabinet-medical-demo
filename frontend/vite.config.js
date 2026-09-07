import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on all interfaces so it is reachable from the local network
    host: '0.0.0.0',
    port: 5173,
    // Proxy API calls to the Django backend so the client only needs ONE URL.
    // The browser serves the frontend AND forwards /api/* to the backend.
    proxy: {
      '/api': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
    },
    // Allow tunnel hosts (localtunnel / ngrok) to reach the dev server
    allowedHosts: [
      '.loca.lt',
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app',
    ],
  },
})
