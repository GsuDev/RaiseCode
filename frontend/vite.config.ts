import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Resuelve los paths del tsconfig.app.json (@/...)
    tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
  ],
  resolve: {
    alias: {
      // Alias explícito como fallback por si tsconfigPaths no lo resuelve
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // CRÍTICO: Permite acceso desde fuera del contenedor
    port: parseInt(process.env.VITE_PORT || "5173"),
    strictPort: true,
    watch: {
      usePolling: true, // CRÍTICO: Para hot-reload en Docker
    },
    hmr: {
      // Usamos el host del navegador para que el HMR funcione correctamente
      // en Docker. Si hay un proxy/reverse proxy, ajusta 'host' y 'port'.
      clientPort: parseInt(process.env.VITE_HMR_CLIENT_PORT || "5173"),
      // Aumentar el timeout de reconexión para evitar spam de errores
      // cuando el contenedor queda en standby
      timeout: 5000,
      // Reintentos de overlay sin bloquear la UI
      overlay: false,
    },
  },
});
