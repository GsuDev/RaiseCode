# HU-29 · Panel Admin — Gestión de Retos

> 🖼️ **Prototipo UI:** _pendiente_

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-05-06 |
| Sprint | Sprint 7 |
| Prioridad | Media |
| Estimación | 5 puntos |

---

## 1. Descripción

**Como** administrador, **quiero** poder ver, editar y eliminar todos los retos de la plataforma desde el panel de administración, **para** mantener el catálogo limpio sin depender de que el autor los modifique.

---

## 2. Dependencias y paralelización

- **Requiere:** HU-22 — estructura del panel admin
- **Requiere:** HU-23 — validación de retos (esta HU amplía esa página)
- **Puede paralelizarse con:** HU-25, HU-29, HU-30

---

## 3. 🗃️ Backend (NestJS)

Ampliar el módulo existente `api/src/challenges/`:

### 🔗 Endpoints nuevos

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/challenges/admin/all` | `JwtAuthGuard` + `@Roles('ADMIN')` | Listar todos los retos (cualquier estado) |
| `PATCH` | `/api/challenges/:id` | `JwtAuthGuard` + `@Roles('ADMIN')` | Editar cualquier campo del reto |
| `DELETE` | `/api/challenges/:id` | `JwtAuthGuard` + `@Roles('ADMIN')` | Eliminar reto |

**Lógica de `DELETE`:** comprobar si el reto tiene submissions (`completions`) asociadas. Si las tiene, devolver error `400`: `"No se puede eliminar un reto con soluciones enviadas"`.

**`GET /api/challenges/admin/all`** devuelve todos los retos paginados, incluyendo `PENDING`, `APPROVED` y `REJECTED`, con campos: `id`, `title`, `status`, `language`, `subject`, `difficulty`, `author`, `createdAt`.

---

## 4. 🎨 Frontend (React)

### 📁 Estructura de ficheros

```
src/admin/pages/challenges/
├── AdminChallengesPage.tsx          ← ampliar la existente (ahora solo muestra pendientes)
├── hooks/
│   ├── usePendingChallenges.tsx     ← ya existe
│   └── useAllChallenges.ts          ← nuevo
├── services/
│   └── adminChallenges.service.ts   ← nuevo
└── components/
    ├── PendingChallengesTable.tsx   ← ya existe
    ├── AllChallengesTable.tsx       ← nueva tabla con todos los retos
    ├── ValidationModal.tsx          ← ya existe
    └── EditChallengeModal.tsx       ← nuevo modal de edición
```

### Comportamiento

- La página muestra dos tabs o secciones: **"Pendientes de validar"** (tabla actual) y **"Todos los retos"** (nueva tabla).
- La tabla "Todos los retos" tiene columnas: título, estado (badge de color), lenguaje, asignatura, dificultad, autor, fecha.
- Cada fila tiene acciones: **Editar** (abre `EditChallengeModal`) y **Eliminar** (AlertDialog de confirmación).
- `EditChallengeModal` permite modificar título, enunciado, dificultad y estado del reto.
- Tras cualquier acción, refrescar la tabla.

---

## 5. Criterios de aceptación ✅

- [ ] La tabla "Todos los retos" muestra retos de cualquier estado con filtro por estado.
- [ ] Se puede editar el título, enunciado y dificultad de un reto existente.
- [ ] Se puede eliminar un reto sin submissions; si tiene submissions se muestra error.
- [ ] Los cambios de estado (aprobar/rechazar) siguen funcionando desde la tab de pendientes.
- [ ] Solo accesible para usuarios con rol ADMIN.
