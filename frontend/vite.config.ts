import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // CRÍTICO: Permite acceso desde fuera del contenedor
    port: parseInt(process.env.VITE_PORT || '5173'),
    strictPort: true,
    watch: {
      usePolling: true, // CRÍTICO: Para hot-reload en Docker
    },
    hmr: {
      clientPort: 5173, // Puerto que usa el navegador
    },
  },
})
