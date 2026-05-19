# Orden de ejecución — Sprint Final
> Fecha: 2026-05-18 · Issues: #82–#92

---

## Ola 1 — Arrancar ya (todo en paralelo, sin dependencias entre sí)

| Issue | Título | Asignado | Nota |
|-------|--------|----------|------|
| **CH-09** #82 | Infraestructura Docker y Nginx para prod | **GsuDev** | BLOQUEANTE para entrega, máxima prioridad |
| **CH-10** #83 | Seed — Kotlin, logros y documentación | **MrsBambi** | Desbloquea HU-36; carloospg no puede empezar sin esto |
| **CH-12** #91 | Bug — Paginación de usuarios incorrecta | **Iaancasve** | Fix aislado, sin dependencias |
| **CH-13** #92 | Bug — WebSocket emite a todos los clientes | **Iaancasve** | Hacerlo antes que HU-36 (comparten código del gateway) |

---

## Ola 2 — En cuanto terminen sus dependencias

| Issue | Título | Asignado | Espera a |
|-------|--------|----------|----------|
| **CH-11** #84 | Perfil — Eliminar mocks de racha y puntos | **carloospg** | Puede empezar ya; coordinar con HU-37 (ver nota abajo) |
| **HU-32** #85 | Admin — Activar/desactivar registro público | **MrsBambi** | Independiente, puede empezar ya |
| **HU-33** #86 | Cancelar ejecución de reto | **GsuDev** | Independiente; empezar cuando CH-09 esté encaminado |
| **HU-34** #87 | XP por velocidad + tiempo visible en resultados | **GsuDev** | Independiente |
| **HU-35** #88 | Ciclo formativo en creación masiva | **MrsBambi** | Independiente |
| **HU-37** #90 | Racha de actividad en perfil de usuario | **Iaancasve** | Independiente; coordinar con CH-11 (ver nota abajo) |

---

## Ola 3 — Solo cuando CH-10 y CH-13 estén completos

| Issue | Título | Asignado | Espera a |
|-------|--------|----------|----------|
| **HU-36** #89 | Logros en tiempo real por WebSocket | **carloospg** | **CH-10** (filas de Achievement en BD) + **CH-13** (rooms por usuario) |

---

## Resumen visual

```
GsuDev:      CH-09 ──────────────────────────────────► (entrega)
             HU-33 ──────────────► (independiente)
             HU-34 ──────────────► (independiente)

MrsBambi:    CH-10 ──────┐ (desbloquea HU-36)
             HU-32 ──────► (independiente)
             HU-35 ──────► (independiente)

carloospg:   CH-11 ──────► (coordinar con HU-37)
             HU-36 ◄── espera CH-10 + CH-13

Iaancasve:   CH-12 ──────► (independiente)
             CH-13 ──────┘ (desbloquea HU-36)
             HU-37 ──────► (coordinar con CH-11)
```

---

## Puntos de coordinación

### carloospg ↔ Iaancasve — Perfil (CH-11 / HU-37)
CH-11 elimina las tarjetas de racha del perfil (valores mock). HU-37 las añade de vuelta con datos reales del backend. Si Iaancasve termina HU-37 antes de que carloospg empiece CH-11, **carloospg puede simplemente reemplazar los valores mock por los reales** en vez de borrar y volver a crear los componentes.

### Iaancasve → carloospg — WebSocket (CH-13 → HU-36)
CH-13 refactoriza `execution.gateway.ts` para usar rooms por `userId`. HU-36 necesita ese mecanismo para emitir logros solo al usuario que los desbloquea. **Iaancasve debe avisar a carloospg cuando CH-13 esté mergeado** para evitar conflictos en el gateway.

### MrsBambi → carloospg — Seed (CH-10 → HU-36)
HU-36 solo funciona si existen filas en la tabla `Achievement`. CH-10 es quien las crea (corrige el seeder comentado y el seed.sql). **MrsBambi debe avisar a carloospg cuando CH-10 esté mergeado y el seed aplicado**.
