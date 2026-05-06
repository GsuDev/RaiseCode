# HU-31 · Integración de Vídeo Multimedia (RA4)

> 🖼️ **Prototipo UI:** _pendiente_

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-05-06 |
| Sprint | Sprint 7 |
| Prioridad | Alta |
| Estimación | 3 puntos |

---

## 1. Descripción

**Como** alumno o visitante, **quiero** ver un vídeo sobre la aplicación, **para** entender rápidamente qué es RaiseCode y cómo funciona.

> **Contexto:** Requisito del módulo de Diseño de Interfaces Web para evaluar el RA4 (integración de elementos multimedia). El vídeo debe ser de creación propia.

---

## 2. Dependencias y paralelización

- **Requiere:** HU-5 — Hero section de la landing (opción 2)
- **Sin dependencias bloqueantes** — se puede hacer en paralelo con cualquier otra HU
- **Nota:** El vídeo debe grabarse antes de implementar esta HU.

---

## 3. Opciones de implementación

Elegir **una** de las dos opciones antes de empezar:

---

### Opción A — Videotutorial accesible por botón

El vídeo explica cómo funciona la app (registro, resolver un reto, ver el perfil). Se abre al pulsar un botón, no se reproduce automáticamente.

**¿Dónde colocarlo?**
En la landing page (`HomePage`), en la sección Hero o debajo de ella. Añadir un botón **"Ver cómo funciona"** que abre un modal con el vídeo incrustado.

**Componente nuevo:** `src/raiseCode/components/HeroSection/components/DemoVideoModal.tsx`

```tsx
// Modal de Chakra UI con un <video> o <iframe> (YouTube/Vimeo)
<Modal isOpen={isOpen} onClose={onClose} size="xl">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Cómo funciona RaiseCode</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <video controls width="100%" src="/videos/demo.mp4" />
      {/* O con YouTube: <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... /> */}
    </ModalBody>
  </ModalContent>
</Modal>
```

**Botón en `HeroSection`:**
```tsx
<Button onClick={onOpen} variant="outline">
  ▶ Ver cómo funciona
</Button>
```

Si el vídeo se aloja localmente, colocarlo en `frontend/public/videos/demo.mp4`.

---

### Opción B — Hero multimedia con vídeo de fondo autoplay

El vídeo se reproduce automáticamente y sin sonido en la sección hero de la landing, mostrando la app en funcionamiento (estilo Notion / Runway).

**Modificar `HeroSection.tsx`** para incluir un `<video>` de fondo:

```tsx
<Box position="relative" overflow="hidden" minH="100vh">
  <video
    autoPlay
    muted
    loop
    playsInline
    style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%', height: '100%',
      objectFit: 'cover',
      zIndex: 0,
      opacity: 0.35,
    }}
    src="/videos/hero-demo.mp4"
  />
  <Box position="relative" zIndex={1}>
    {/* contenido actual del hero */}
  </Box>
</Box>
```

El vídeo debe ser corto (< 30s), en bucle, sin audio. Colocarlo en `frontend/public/videos/hero-demo.mp4`.

---

## 4. 🎨 Frontend — Consideraciones comunes

### Imágenes optimizadas

El RA4 también requiere **imágenes optimizadas**. Revisar que las imágenes existentes:
- Usan formato `webp` o `avif` en lugar de `png`/`jpg` donde sea posible
- Tienen atributo `loading="lazy"` en imágenes fuera del viewport inicial
- Tienen dimensiones explícitas (`width` y `height`) para evitar layout shift

### Accesibilidad del vídeo

- Opción A: el modal debe cerrarse con `Esc` y tener foco correcto (Chakra lo gestiona por defecto).
- Opción B: añadir `aria-hidden="true"` al `<video>` de fondo para que los lectores de pantalla lo ignoren.

---

## 5. Criterios de aceptación ✅

- [ ] Existe al menos un vídeo de creación propia integrado en la aplicación.
- [ ] **Opción A:** El botón "Ver cómo funciona" abre un modal con el vídeo reproducible.
- [ ] **Opción B:** El vídeo de fondo se reproduce automáticamente, en bucle y sin sonido en la landing.
- [ ] El vídeo no bloquea la navegación ni la carga de la página.
- [ ] Las imágenes de la landing están optimizadas (formato, lazy loading).
- [ ] En dispositivos móviles la experiencia es correcta (el vídeo no desborda ni rompe el layout).
