import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Definimos los colores base de tu marca (Brand Colors)
        brand: {
          50: { value: "#e6f6ec" },
          100: { value: "#c0e8d0" },
          200: { value: "#98d9b3" },
          300: { value: "#70ca95" },
          400: { value: "#4bbc78" },
          500: { value: "#22b157" }, // Tu verde principal
          600: { value: "#1b8e46" },
          700: { value: "#146a34" },
          800: { value: "#0d4723" },
          900: { value: "#062411" },
        },
        error: {
          500: { value: "#ef4444" },
          900: { value: "#450a0a" },
        },
      },
    },
    semanticTokens: {
      colors: {
        // --- COLORES DE FONDO ---
        bg: {
          canvas: {
            value: { 
              _light: "#f8f9fa",     // Claro: Gris muy suave (casi blanco)
              _dark: "#0e0a19"       // Oscuro: Tu violeta profundo original
            },
          },
          panel: {
            value: { 
              _light: "#ffffff",     // Claro: Blanco puro para tarjetas
              _dark: "#1b1424"       // Oscuro: Tu violeta de tarjetas
            },
          },
          subtle: {
            value: { 
              _light: "#b9b9b9",     // Claro: Gris intermedio para hover
              _dark: "#2d2638"       // Oscuro: Un violeta ligeramente más claro
            },
          },
        },

        // --- COLORES DE PRIMER PLANO (TEXTO) ---
        fg: {
          DEFAULT: {
            value: { 
              _light: "#1a202c",     // Claro: Gris oscuro (casi negro) para lectura
              _dark: "#ffffff"       // Oscuro: Blanco puro
            },
          },
          muted: {
            value: { 
              _light: "#718096",     // Claro: Gris medio
              _dark: "#9e9ca1"       // Oscuro: Tu gris de texto secundario
            },
          },
        },

        // --- COLORES DE ACCIÓN (BOTONES) ---
        primary: {
          solid: {
            value: "{colors.brand.500}", // El mismo verde en ambos modos
          },
          contrast: {
            value: "#ffffff",            // Texto blanco sobre el botón verde
          },
          muted: {
            value: {
              _light: "{colors.brand.50}",
              _dark: "rgba(34, 177, 87, 0.1)" // Verde transparente para fondos sutiles
            }
          }
        },
        
        // --- BORDES ---
        border: {
          DEFAULT: {
            value: {
              _light: "#2d2638",
              _dark: "#e2e8f0" // Borde sutil basado en tus colores
            }
          }
        }
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
