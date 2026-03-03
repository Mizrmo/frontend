import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'https://sandbox-api.mizrmo.com',
                changeOrigin: true,
                secure: false,
                ws: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        // Remove Origin to avoid CORS/Forbidden issues on strict servers
                        proxyReq.removeHeader('Origin');
                        proxyReq.removeHeader('Referer');
                    });
                },
            }
        }
    }
})
